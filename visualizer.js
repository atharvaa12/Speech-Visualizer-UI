const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const landing = document.getElementById("landing");
const controls = document.getElementById("controls");

let audioCtx, analyser, source, gain, stream;
let running = false;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const size = Math.min(window.innerWidth, window.innerHeight - 160) * 0.9;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", resize);
resize();

startBtn.onclick = async () => {
  landing.classList.add("hidden");
  controls.classList.remove("hidden");

  stream = await navigator.mediaDevices.getUserMedia({ audio:true });
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await audioCtx.resume();

  source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.8;

  gain = audioCtx.createGain();
  gain.gain.value = 3;

  source.connect(gain);
  gain.connect(analyser);

  running = true;
  animate();
};

stopBtn.onclick = () => {
  running = false;
  controls.classList.add("hidden");
  landing.classList.remove("hidden");

  stream.getTracks().forEach(t => t.stop());
  audioCtx.close();
  ctx.clearRect(0,0,canvas.width,canvas.height);
};

function animate(){
  if(!running) return;
  requestAnimationFrame(animate);

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  draw(data);
}
let rot = 0;

function draw(data){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  rot+=0.0006;
  const cx = canvas.clientWidth/2;
  const cy = canvas.clientHeight/2;

  let bass=0;
  for(let i=0;i<12;i++) bass+=data[i];
  bass/=12;

  const pulse = 1 + bass/350;
  const radius = Math.min(cx,cy)*0.34*pulse;

  
  ctx.shadowBlur = 60;
  ctx.shadowColor = "#00ffd5";
  ctx.beginPath();
  ctx.arc(cx,cy,radius*0.5,0,Math.PI*2);
  ctx.fillStyle="rgba(0,255,213,0.08)";
  ctx.fill();

  
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(cx,cy,radius*0.9,0,Math.PI*2);
  ctx.strokeStyle="rgba(0,255,213,0.18)";
  ctx.lineWidth=4;
  ctx.stroke();

  
ctx.beginPath();
ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
ctx.strokeStyle = "rgba(255,255,255,0.06)";
ctx.lineWidth = 1.2;
ctx.shadowBlur = 0;
ctx.stroke();

  for(let i=0;i<data.length;i++){
    const angle = i/data.length*Math.PI*2+rot;
    const power = data[i]/255;
    const bar = power*radius*0.95;

    const x1=cx+Math.cos(angle)*radius;
    const y1=cy+Math.sin(angle)*radius;
    const x2=cx+Math.cos(angle)*(radius+bar);
    const y2=cy+Math.sin(angle)*(radius+bar);

    ctx.strokeStyle=`hsl(${(i*2+performance.now()*0.05)%360},100%,60%)`;
    ctx.lineWidth=2.4;
    ctx.shadowBlur=18;
    ctx.shadowColor=ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
}
