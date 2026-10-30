// The range's shaders, ported from the approved prototype (prototype/site.html) without the rejected
// parallax (ADR 0003). Each cell samples the plate; wind, water, cloud and fog bend that sample into a glyph.
export const VERTEX = `#version 300 es
in vec2 pos; void main() { gl_Position = vec4(pos, 0., 1.); }`;

export const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D plate, atlas, terrain;
uniform sampler2D depth;   // near ground: 1 near, 0 far
uniform vec2 res, cell;
uniform vec4 cover, water;
uniform vec3 focus;
uniform float time, glyphs, atlasSize, boldFrom, boldMist, fogScale, edge, night;
out vec4 color;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }

void main() {
  vec2 p = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);
  vec2 c = floor(p / cell), local = (p - c * cell) / cell;
  vec2 uv = ((c + .5) * cell - cover.xy) / cover.zw;
  float base = texture(plate, uv).r;

  float trees = smoothstep(.55, .2, base) * smoothstep(.42, .62, uv.y);
  float gust = pow(.5 + .5 * sin(time * .6 - uv.x * 6.), 3.);
  float dx = (sin(time * 2.2 + uv.y * 170. + uv.x * 35.) * .35 + gust) * .0018 * trees * uv.y;

  vec2 wc = (water.xy + water.zw) * .5, wr = (water.zw - water.xy) * .5;
  vec2 wd = abs(uv - wc) / wr;
  float river = (1. - smoothstep(.6, 1., wd.x)) * (1. - smoothstep(.5, 1., wd.y)) * smoothstep(.68, .86, base);
  dx += sin(uv.y * 700. - time * 2.6) * .0012 * river;

  // Average the cell's footprint, not one point, so tone reads as wash instead of speckle.
  vec2 q = uv + vec2(dx, 0.), h = cell / cover.zw * .25;
  float lum = (texture(plate, q + vec2(-h.x, -h.y)).r + texture(plate, q + vec2(h.x, -h.y)).r
             + texture(plate, q + vec2(-h.x, h.y)).r + texture(plate, q + vec2(h.x, h.y)).r) * .25;

  float mist = smoothstep(.6, .82, lum) * (1. - smoothstep(.92, .985, lum)) * smoothstep(.05, .12, 1. - base);
  float drift = fbm(uv * vec2(2.6, 6.) - vec2(time * .03, time * .004));
  lum += (drift - .5) * .2 * mist;
  float shadow = fbm(uv * vec2(1.4, 2.2) - vec2(time * .012, 0.));
  float body = smoothstep(.08, .2, 1. - base);
  lum -= smoothstep(.55, .75, shadow) * .07 * body;

  // Fog banks: white patches that drift gently left to right across the slopes.
  // Fog moves like a fluid: a warped flow field carries dense banks rightward,
  // covering the slopes and revealing them again as it passes.
  vec2 fq = uv * vec2(1.6, 4.);
  vec2 flow = vec2(fbm(fq + vec2(0., time * .05)), fbm(fq + vec2(5.2, 1.3) - vec2(time * .04)));
  float bank = fbm(fq + 1.8 * flow - vec2(time * .025, 0.));
  float band = smoothstep(.3, .45, uv.y) * (1. - smoothstep(.8, .95, uv.y));
  // Smaller screens see less of the range, so the same banks would bury it: thinner, sparser fog there.
  float fog = smoothstep(mix(.54, .44, fogScale), mix(.68, .62, fogScale), bank) * band * body * mix(.55, 1., fogScale);

  // Dodge and burn: push each cell away from its neighbourhood, the way Adams separated forms in fog.
  vec2 r = cell / cover.zw * 6.;
  float around = (texture(plate, uv + vec2(r.x, 0.)).r + texture(plate, uv - vec2(r.x, 0.)).r
                + texture(plate, uv + vec2(0., r.y)).r + texture(plate, uv - vec2(0., r.y)).r) * .25;
  lum += (lum - around) * .6 * body;

  // N+1: expand the mid-tones around Zone V; keep snow and fog (IX-X) white and blacks anchored.
  float zone = clamp((lum - .62) * 1.2 + .62, 0., 1.);
  zone = lum > .9 ? lum : zone;
  float dark = pow(clamp((.94 - zone) / .8, 0., 1.), .75);
  float lift = focus.z * (1. - smoothstep(.02, .14, length((uv - focus.xy) * vec2(1.77, 1.))));
  dark *= 1. - fog * .95 * (1. - lift);   // fog sits in front of the print, so it veils after the tones are set
  dark = mix(dark, min(1., dark * 1.2), lift);
  // The river is bright, so its current is drawn as ripples that run downstream.
  float ripple = .5 + .5 * sin(uv.x * 420. - uv.y * 160. - time * 3.2 + noise(uv * 80.) * 4.);
  dark = max(dark, river * smoothstep(.55, .95, ripple) * .42);
  dark = min(dark, .9);   // shadows keep their texture (Zones II-III): never solid black
  // The art ends in mist, never on a ruled line: the bottom thins through the ramp the way the desktop plate's
  // own fog does, along an edge that wanders across the width. Scrolling away lifts the mist higher.
  // The edge only ever reaches up, so the last row is always clear; fine jitter keeps any stretch from running flat.
  float tear = fbm(vec2(c.x * .03, 7.)) * .12 + fbm(vec2(c.x * .35, 3.)) * .035;
  float raw = (res.y - c.y * cell.y) / res.y;
  float fade = 1. - smoothstep(0., mix(.1, .26, edge), raw - tear);
  fade = clamp(fade + (fbm(c * vec2(.06, .14) + 11.) - .5) * .5 * fade * (1. - fade) * 2., 0., 1.);   // patchy, like drifting fog
  dark *= 1. - fade;
  // Dither where the glyph steps down, so each step breaks raggedly instead of along a smooth contour.
  dark = max(0., dark + (hash(c + 5.7) - .5) / glyphs * 1.6 * step(.02, fade) * step(.001, dark));
  float g = floor(dark * (glyphs - 1.) + .5);

  bool current = river * smoothstep(.45, .9, ripple) > .18;
  if (current) { g = glyphs; dark = max(dark, .75); }             // '~' rides the current

  // Near ground takes the bold row of the atlas; a dithered seam keeps the switch from drawing a line.
  float near = texture(depth, uv).r;
  float bold = step(hash(c) * .16 + boldFrom, near) * step(.3 * boldMist, dark);   // mist on the near hill stays light
  float ink = texture(atlas, vec2((g + local.x) / atlasSize, (local.y + bold) * .5)).a;
  vec3 day = vec3(.933, .922, .898), dusk = vec3(.047);
  vec3 paper = mix(day, dusk, night), inkc = mix(dusk, day, night);   // at night the glyphs are drawn in paper
  vec3 rgb = mix(paper, inkc, ink * (.8 + .2 * dark));
  float a = max(body, ink);
  color = vec4(rgb * a, a);
}`;
