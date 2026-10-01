(() => {
 'use strict';
 const canvas=document.getElementById('cosmos-stars');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const control=document.getElementById('motion-control');
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,stars=[],frame=0,last=0,paused=false,visible=!document.hidden;
 let targetX=0,targetY=0,driftX=0,driftY=0;
 const rand=(a,b)=>a+Math.random()*(b-a);
 function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:width<700?65:145},()=>({x:rand(0,width),y:rand(0,height),r:rand(.45,1.5),phase:rand(0,Math.PI*2),depth:rand(.3,1),speed:rand(.6,1.5)}));paint(0)}
 function paint(time){ctx.clearRect(0,0,width,height);const still=paused||media.matches;driftX+=(targetX-driftX)*.025;driftY+=(targetY-driftY)*.025;
 for(const s of stars){const twinkle=still?.65:.4+.3*Math.sin(time*.0007*s.speed+s.phase);const x=((s.x+(still?0:time*.002*s.depth)+driftX*s.depth)%width+width)%width;const y=((s.y+driftY*s.depth)%height+height)%height;ctx.globalAlpha=twinkle;ctx.fillStyle='#d9f3ff';ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill();if(s.r>1.3){ctx.globalAlpha=twinkle*.2;ctx.beginPath();ctx.arc(x,y,s.r*3.5,0,Math.PI*2);ctx.fill()}}
 ctx.globalAlpha=1;
 }
 function tick(time){frame=0;if(!visible||paused||media.matches)return;if(time-last>=33){paint(time);last=time}frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;const stopped=paused||media.matches;document.body.classList.toggle('motion-paused',stopped);control.hidden=media.matches;control.setAttribute('aria-pressed',String(paused));control.textContent=paused?'Play animation':'Pause animation';paint(0);if(!stopped&&visible)frame=requestAnimationFrame(tick)}
 control.hidden=false;control.addEventListener('click',()=>{paused=!paused;sync()});
 addEventListener('resize',resize,{passive:true});
 addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||paused||media.matches)return;targetX=(e.clientX/width-.5)*22;targetY=(e.clientY/height-.5)*18;document.documentElement.style.setProperty('--cosmos-x',`${targetX*.35}px`);document.documentElement.style.setProperty('--cosmos-y',`${targetY*.35}px`)},{passive:true});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;sync()});media.addEventListener('change',sync);
 resize();sync();
 if(!media.matches && 'IntersectionObserver' in window){const sections=document.querySelectorAll('.home-work,.life-preview');sections.forEach(el=>el.classList.add('cosmic-reveal'));const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}},{threshold:.12});sections.forEach(el=>observer.observe(el))}
})();
