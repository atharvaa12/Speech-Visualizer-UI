const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

function resize() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

startBtn.onclick = async () => {
  startBtn.remove();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await audioCtx.resume(); // IMPORTANT

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.8;

  // BOOST mic volume
  const gain = audioCtx.createGain();
  gain.gain.value = 3;

  source.connect(gain);
  gain.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  let lastTime = 0;
  const FPS = 60;
  const frameTime = 1000 / FPS;

  function animate(now) {
    requestAnimationFrame(animate);

    if (now - lastTime < frameTime) return;
    lastTime = now;

    analyser.getByteFrequencyData(dataArray);
    draw(dataArray);
  }

  animate();

  function draw(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) * 0.35;
   
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const power = data[i] / 255;
      

      const barLength = power * radius * 0.9;
      
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(angle) * (radius + barLength);
      const y2 = cy + Math.sin(angle) * (radius + barLength);

      ctx.strokeStyle = `hsl(${(i / data.length) * 360},100%,60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
};
