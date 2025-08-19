// Tiny confetti using the canvas layer
export function confetti(){
  const c = document.getElementById('fxLayer');
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const particles = Array.from({length: 80}, ()=> ({
    x: Math.random()*c.width,
    y: -20, v: 2+Math.random()*3, s: 2+Math.random()*4, a: Math.random()*Math.PI*2,
    color: `hsl(${Math.random()*360}, 85%, 60%)`
  }));
  let t = 0, maxT = 60; // ~1s at 60fps
  function frame(){
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(p=>{
      p.y += p.v; p.x += Math.sin(p.a+t*0.1)*1.2;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    t++;
    if(t < maxT) requestAnimationFrame(frame); else ctx.clearRect(0,0,c.width,c.height);
  }
  frame();
}
