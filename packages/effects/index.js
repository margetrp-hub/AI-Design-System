import { vertex, rays, grid } from "./shaders.js";
const clamp = (v, a, b, fallback) =>
  Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : fallback;
export function observeActivity(host, callback) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  const sync = () => callback(!document.hidden && !reduce.matches && visible);
  const observer =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
          sync();
        })
      : null;
  observer?.observe(host);
  document.addEventListener("visibilitychange", sync);
  reduce.addEventListener("change", sync);
  sync();
  return () => {
    observer?.disconnect();
    document.removeEventListener("visibilitychange", sync);
    reduce.removeEventListener("change", sync);
  };
}
export function mountBackdrop(host, initial = {}) {
  let options = {
    kind: "rays",
    paused: false,
    intensity: 1,
    speed: 1,
    color: "#579eff",
    ...initial,
  };
  let canvas,
    gl,
    program,
    buffer,
    drawFrame,
    frame = 0,
    time = 0,
    last = 0,
    active = true,
    disposed = false,
    failed = false,
    stopActivity = () => {},
    size;
  const pointer = { x: 0.52, y: 0.45 },
    shaders = [],
    pointerRoot = host.parentElement ?? host;
  const state = (value) => {
    host.dataset.effectState = value;
    options.onState?.(value);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };
  const cleanGPU = () => {
    if (gl) {
      shaders.splice(0).forEach((shader) => gl.deleteShader(shader));
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    }
    buffer = program = undefined;
    gl = undefined;
  };
  const draw = (stamp) => {
    frame = 0;
    if (disposed || failed) return;
    time += last
      ? Math.min(stamp - last, 50) * 0.001 * clamp(options.speed, 0, 3, 1)
      : 0;
    last = stamp;
    drawFrame?.(time);
    if (active && !options.paused && options.speed !== 0)
      frame = requestAnimationFrame(draw);
  };
  function sync() {
    stop();
    if (disposed || failed) return;
    const running = active && !options.paused && options.speed !== 0;
    host.dataset.paused = String(!running);
    state(running ? "running" : "paused");
    drawFrame?.(time);
    if (running && drawFrame) frame = requestAnimationFrame(draw);
  }
  const move = (event) => {
    if (!active || options.paused || event.pointerType === "touch") return;
    const box = host.getBoundingClientRect();
    pointer.x = clamp((event.clientX - box.left) / box.width, 0, 1, 0.5);
    pointer.y = clamp((event.clientY - box.top) / box.height, 0, 1, 0.5);
  };
  const lost = (event) => {
    event.preventDefault();
    stop();
    failed = true;
    state("fallback");
    host.dataset.paused = "true";
  };
  const restored = () => init();
  function removeCanvas() {
    if (canvas) {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      canvas.remove();
    }
    canvas = undefined;
  }
  function resize() {
    if (!canvas) return;
    const box = host.getBoundingClientRect(),
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(box.width * dpr));
    canvas.height = Math.max(1, Math.round(box.height * dpr));
    gl?.viewport(0, 0, canvas.width, canvas.height);
    sync();
  }
  function init() {
    stop();
    cleanGPU();
    removeCanvas();
    failed = false;
    drawFrame = undefined;
    host.dataset.kind = options.kind;
    host.style.setProperty(
      "--ui-effect-color",
      /^#[\da-f]{6}$/i.test(options.color) ? options.color : "#579eff",
    );
    host.style.setProperty(
      "--ui-effect-intensity",
      String(clamp(options.intensity, 0, 2, 1)),
    );
    if (options.kind === "nebula") {
      sync();
      return;
    }
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.append(canvas);
    try {
      if (options.kind === "particles") {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw Error("Canvas 2D unavailable");
        // Fixed seeds keep identity stable across pause, resize, and rerender.
        const dots = Array.from({ length: 64 }, (_, i) => ({
          x: ((i * 73 + 19) % 101) / 101,
          y: ((i * 47 + 7) % 103) / 103,
          r: 0.6 + (i % 4) * 0.45,
          s: 0.4 + (i % 7) * 0.07,
        }));
        drawFrame = (t) => {
          const { width: w, height: h } = canvas;
          ctx.clearRect(0, 0, w, h);
          const tint = /^#[\da-f]{6}$/i.test(options.color)
            ? options.color
            : "#579eff";
          ctx.fillStyle = tint;
          ctx.shadowColor = tint;
          ctx.shadowBlur = 12;
          dots.forEach((p, i) => {
            const x = (p.x + Math.sin(t * p.s + i) * 0.025) * w,
              y = ((((p.y - t * 0.012 * p.s) % 1) + 1) % 1) * h;
            ctx.globalAlpha =
              (0.25 + 0.55 * (Math.sin(t * p.s + i) * 0.5 + 0.5)) *
              clamp(options.intensity, 0, 2, 1);
            ctx.beginPath();
            ctx.arc(
              x,
              y,
              p.r * Math.min(window.devicePixelRatio || 1, 2),
              0,
              Math.PI * 2,
            );
            ctx.fill();
          });
          ctx.globalAlpha = 1;
        };
      } else {
        gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        if (!gl) throw Error("WebGL unavailable");
        const compile = (type, source) => {
          const shader = gl.createShader(type);
          if (!shader) throw Error("Shader allocation failed");
          shaders.push(shader);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw Error("Shader compile failed");
          return shader;
        };
        program = gl.createProgram();
        if (!program) throw Error("Program allocation failed");
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
        gl.attachShader(
          program,
          compile(gl.FRAGMENT_SHADER, options.kind === "grid" ? grid : rays),
        );
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw Error("Shader link failed");
        shaders.splice(0).forEach((shader) => gl.deleteShader(shader));
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]),
          gl.STATIC_DRAW,
        );
        gl.useProgram(program);
        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        const uniforms = Object.fromEntries(
          ["time", "resolution", "pointer", "tint", "intensity"].map((key) => [
            key,
            gl.getUniformLocation(program, key),
          ]),
        );
        drawFrame = (t) => {
          const hex = /^#[\da-f]{6}$/i.test(options.color)
            ? options.color
            : "#579eff";
          gl.useProgram(program);
          gl.uniform1f(uniforms.time, t);
          gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
          gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
          gl.uniform3f(
            uniforms.tint,
            ...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255),
          );
          gl.uniform1f(uniforms.intensity, clamp(options.intensity, 0, 2, 1));
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        canvas.addEventListener("webglcontextlost", lost);
        canvas.addEventListener("webglcontextrestored", restored);
      }
      resize();
    } catch {
      failed = true;
      stop();
      cleanGPU();
      removeCanvas();
      host.dataset.paused = "true";
      state("fallback");
    }
  }
  size = new ResizeObserver(resize);
  size.observe(host);
  pointerRoot.addEventListener("pointermove", move, { passive: true });
  init();
  stopActivity = observeActivity(host, (value) => {
    active = value;
    sync();
  });
  return {
    update(next) {
      if (disposed) return;
      const rebuild = next.kind !== undefined && next.kind !== options.kind;
      options = { ...options, ...next };
      if (rebuild) init();
      else {
        host.style.setProperty(
          "--ui-effect-color",
          /^#[\da-f]{6}$/i.test(options.color) ? options.color : "#579eff",
        );
        host.style.setProperty(
          "--ui-effect-intensity",
          String(clamp(options.intensity, 0, 2, 1)),
        );
        sync();
      }
    },
    retry() {
      if (!disposed) init();
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      stop();
      stopActivity();
      size.disconnect();
      pointerRoot.removeEventListener("pointermove", move);
      cleanGPU();
      removeCanvas();
      state("disposed");
    },
  };
}
export function mountCharacters(host, initial = {}) {
  let options = { mode: "idle", paused: false, ...initial },
    active = true,
    frame = 0;
  const scene = document.createElement("div");
  scene.className = "ui-auth-character-stage";
  for (const shape of ["tall", "dark", "coral", "gold"]) {
    const body = document.createElement("div");
    body.className = "ui-auth-character ui-auth-" + shape;
    body.innerHTML =
      '<span class="ui-auth-face"><span class="ui-auth-eye"><i></i></span><span class="ui-auth-eye"><i></i></span><span class="ui-auth-mouth"></span></span>';
    scene.append(body);
  }
  host.append(scene);
  const sync = () => {
    host.dataset.mode = options.mode;
    host.dataset.paused = String(options.paused || !active);
    if (options.paused || !active) {
      cancelAnimationFrame(frame);
      frame = 0;
      host.style.setProperty("--look-x", "0px");
      host.style.setProperty("--look-y", "0px");
      host.style.setProperty("--lean", "0deg");
    }
  };
  const stopActivity = observeActivity(host, (value) => {
    active = value;
    sync();
  });
  const move = (event) => {
    if (!active || options.paused || event.pointerType === "touch") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      const box = host.getBoundingClientRect();
      const dx = clamp(
          (event.clientX - box.left - box.width / 2) / box.width,
          -1,
          1,
          0,
        ),
        dy = clamp(
          (event.clientY - box.top - box.height / 2) / box.height,
          -1,
          1,
          0,
        );
      host.style.setProperty("--look-x", `${dx * 3}px`);
      host.style.setProperty("--look-y", `${dy * 2}px`);
      host.style.setProperty("--lean", `${dx * -3}deg`);
    });
  };
  window.addEventListener("pointermove", move, { passive: true });
  sync();
  return {
    update(next) {
      options = { ...options, ...next };
      sync();
    },
    destroy() {
      cancelAnimationFrame(frame);
      stopActivity();
      window.removeEventListener("pointermove", move);
      scene.remove();
    },
  };
}
export function trackIndicator(host) {
  const update = () => {
    const selected = host.querySelector('[aria-current="page"]');
    if (!selected) return;
    const r = selected.getBoundingClientRect(),
      box = host.getBoundingClientRect();
    host.style.setProperty(
      "--indicator-x",
      `${r.left - box.left + host.scrollLeft}px`,
    );
    host.style.setProperty(
      "--indicator-y",
      `${r.top - box.top + host.scrollTop}px`,
    );
    host.style.setProperty("--indicator-width", `${r.width}px`);
    host.style.setProperty("--indicator-height", `${r.height}px`);
  };
  const resize = new ResizeObserver(update),
    mutation = new MutationObserver(() => {
      host.querySelectorAll("button").forEach((el) => resize.observe(el));
      update();
    });
  resize.observe(host);
  host.querySelectorAll("button").forEach((el) => resize.observe(el));
  mutation.observe(host, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-current"],
    childList: true,
  });
  update();
  return () => {
    resize.disconnect();
    mutation.disconnect();
  };
}
