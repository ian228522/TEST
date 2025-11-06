// Twinkling star overlay on top of background image.
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
const DPR = Math.min(2, window.devicePixelRatio || 1);
let W=0, H=0;

function resize(){
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth+'px';
  canvas.style.height = innerHeight+'px';
  initStars(); // re-seed stars on resize
}
addEventListener('resize', resize);

let stars = [];
function initStars(){
  const count = Math.floor(Math.min(420, Math.max(160, (innerWidth*innerHeight)/4000)));
  stars = new Array(count).fill(0).map(()=>{
    const layer = Math.random() < 0.7 ? 1 : (Math.random() < 0.8 ? 2 : 3);
    const baseA = 0.15 + Math.random()*0.65;
    return {
      x: Math.random()*W,
      y: Math.random()*H,
      r: (layer===1? 0.8 : layer===2? 0.6 : 0.5) * DPR + Math.random()*0.8*DPR,
      a: baseA,
      aDir: Math.random() < 0.5 ? 1 : -1,
      aSpeed: (0.002 + Math.random()*0.004) * (layer===3?0.5:1),
      vx: (Math.random()*0.02 + 0.01) * (layer===1? 0.25 : layer===2? 0.15 : 0.08) * DPR,
      vy: (Math.random()*0.02 + 0.01) * (layer===1? 0.07 : layer===2? 0.05 : 0.03) * DPR
    };
  });
}

function step(){
  ctx.clearRect(0,0,W,H);
  ctx.globalCompositeOperation = 'screen';
  for(const s of stars){
    s.a += s.aDir * s.aSpeed;
    if(s.a > 0.95){ s.a=0.95; s.aDir = -1; }
    if(s.a < 0.08){ s.a=0.08; s.aDir = 1; }
    s.x += s.vx;
    s.y -= s.vy;
    if(s.x > W+10) s.x = -10;
    if(s.y < -10) s.y = H+10;

    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3.5);
    g.addColorStop(0, `rgba(255,255,255,${s.a})`);
    g.addColorStop(1, `rgba(120,170,255,0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r*3.5, 0, Math.PI*2); ctx.fill();

    ctx.globalAlpha = Math.min(1, s.a+0.05);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(step);
}

resize();
requestAnimationFrame(step);
