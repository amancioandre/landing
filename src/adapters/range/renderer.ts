import { FRAGMENT, VERTEX } from "./shader";
import type { Rect } from "../../domain/range/geometry";

/** Everything the shader needs for one layout; computed by the range view from the domain. */
export interface Scene {
  cover: Rect;                                   // the plate on screen, CSS px
  ramp: string;
  cellPx: number;
  bold: { from: number; stroke: number };
  boldMist: boolean;                             // whether light mist on the near hill stays regular weight
  fog: number;
}

const FRAME_MS = 1000 / 30;   // fog and wind move slowly; 30 frames a second is plenty and halves the GPU's work
const UNIFORMS = ["plate", "atlas", "terrain", "depth", "res", "cell", "cover", "focus", "time", "glyphs",
  "atlasSize", "boldFrom", "boldMist", "fogScale", "edge", "night"] as const;

/** Draws the range into a canvas with WebGL2. Owns only drawing: layout comes from the domain. */
export class RangeRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly u = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  private readonly textures: (WebGLTexture | null)[] = [];
  private readonly calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private focus = { x: 0, y: 0, level: 0, target: 0 };
  private running = false;
  private visible = true;
  private last = -Infinity;

  static create(canvas: HTMLCanvasElement): RangeRenderer | null {
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
    return gl ? new RangeRenderer(canvas, gl) : null;
  }

  private constructor(private readonly canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.gl = gl;
    const program = gl.createProgram()!;
    gl.attachShader(program, this.compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, this.compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    for (const name of UNIFORMS) this.u[name] = gl.getUniformLocation(program, name);
    gl.uniform1i(this.u.plate, 0); gl.uniform1i(this.u.atlas, 1); gl.uniform1i(this.u.terrain, 2); gl.uniform1i(this.u.depth, 4);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  setPlate(plate: TexImageSource, near: TexImageSource): void {
    this.texture(0, plate);
    this.texture(2, plate, true);
    this.texture(4, near);
  }

  layout(scene: Scene): void {
    const { gl, canvas, u } = this;
    const dpr = Math.min(3, devicePixelRatio || 1);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    const atlas = glyphAtlas(scene.ramp, scene.cellPx * dpr, scene.bold.stroke * dpr);
    this.texture(1, atlas.canvas);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform2f(u.cell, atlas.w, atlas.h);
    gl.uniform1f(u.glyphs, scene.ramp.length);
    gl.uniform1f(u.atlasSize, scene.ramp.length);
    gl.uniform1f(u.boldFrom, scene.bold.from);
    gl.uniform1f(u.boldMist, scene.boldMist ? 1 : 0);
    gl.uniform1f(u.fogScale, scene.fog);
    const { x, y, width, height } = scene.cover;
    gl.uniform4f(u.cover, x * dpr, y * dpr, width * dpr, height * dpr);
    this.draw(performance.now());
  }

  /** Lifts the fog around a stop (as plate fractions), as if the light found that slope. */
  setFocus(at: { x: number; y: number } | null): void {
    if (at) this.focus = { ...this.focus, x: at.x, y: at.y, target: 1 }; else this.focus.target = 0;
  }

  setNight(night: boolean): void { this.gl.uniform1f(this.u.night, night ? 1 : 0); this.draw(performance.now()); }
  setEdge(progress: number): void { this.gl.uniform1f(this.u.edge, progress); if (this.calm) this.draw(performance.now()); }
  setVisible(visible: boolean): void { this.visible = visible; }

  start(): void {
    if (this.running || this.calm) return;
    this.running = true;
    const loop = (ms: number) => {
      if (ms - this.last >= FRAME_MS - 2 && this.visible) { this.last = ms; this.draw(ms); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private draw(ms: number): void {
    const { gl, u, focus } = this;
    focus.level += (focus.target - focus.level) * (this.calm ? 1 : 0.1);
    gl.uniform1f(u.time, this.calm ? 0 : ms / 1000);
    gl.uniform3f(u.focus, focus.x, focus.y, focus.level);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // One texture per unit, replaced in place, so re-layouts never leave old ones on the GPU.
  private texture(unit: number, source: TexImageSource, mipmaps = false): void {
    const { gl } = this;
    if (this.textures[unit]) gl.deleteTexture(this.textures[unit]);
    const t = (this.textures[unit] = gl.createTexture());
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  private compile(type: number, source: string): WebGLShader {
    const s = this.gl.createShader(type)!;
    this.gl.shaderSource(s, source);
    this.gl.compileShader(s);
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) throw new Error(this.gl.getShaderInfoLog(s) ?? "shader");
    return s;
  }
}

// Two rows of glyphs: regular, then bold for the near ground (ADR 0006). System monospace, drawn in white;
// the shader colours them. A thin stroke guarantees the extra weight where the system font has no true bold.
function glyphAtlas(chars: string, px: number, stroke: number) {
  const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono") || "monospace";
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `${px}px ${mono}`;
  const w = Math.ceil(probe.measureText("M").width), h = Math.ceil(px);
  const canvas = document.createElement("canvas");
  canvas.width = w * chars.length;
  canvas.height = h * 2;
  const g = canvas.getContext("2d")!;
  g.textBaseline = "middle";
  g.fillStyle = g.strokeStyle = "#fff";
  g.font = probe.font;
  [...chars].forEach((ch, i) => g.fillText(ch, i * w, h / 2));
  g.font = `700 ${probe.font}`;
  g.lineWidth = stroke;
  [...chars].forEach((ch, i) => { g.fillText(ch, i * w, h * 1.5); g.strokeText(ch, i * w, h * 1.5); });
  return { canvas, w, h };
}
