// A paper conveyor: a slotted intake, a processing arch, and a receiving tray.
// Cards are logs; hovering slows the shared belt clock to follow a record.
const { Cam, fit, proj, facing, rings, rrect, ringAt, run, hull, poly, open, seg,
  prism, solid, put, mk, clamp, spring, stepS, reducedMotion, register, pointer, disposer } = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, 0.5, 1.65);
  fit(C, [[-27,-5,0],[198,56,0],[-27,56,0],[198,-5,0],[68,-5,76]], 200, 166);
  const P = proj(C), front = facing(C), root = mk("g", {}, svg);
  const line = (g, d, cls = "nf lo") => mk("path", { d, class: cls }, g);
  function block(g, x0, y0, x1, y1, z0, z1, r = 3) {
    const [ring, inner] = rings(x0,y0,x1,y1,r,0.8), el = solid(g);
    put(el, prism(P,front,ring,inner,z0,z1));
    return el;
  }
  // Supports and an opaque rounded belt bed, in depth order.
  for (const [x,y] of [[8,4],[127,4],[8,39],[127,39]]) block(root,x,y,x+8,y+7,0,24,2);
  block(root,-19,-3,150,50,20,29,9);
  block(root,-12,1,145,46,29,30.5,7);
  // Roller ends distinguish a conveyor from a plain table.
  for (const x of [-9,139]) {
    line(root,poly(rrect(x-5,20,x+5,30,5,10).map(q=>P(q.u,50,q.v))),"sil");
    line(root,poly(rrect(x-2,23,x+2,27,2,8).map(q=>P(q.u,50,q.v))),"nf lo");
  }
  // Intake: a slotted hood and an uneven pile of incoming records.
  const intake = mk("g",{},root);
  block(intake,-26,-4,1,48,29,39,4);
  const mouth = line(intake,poly(rrect(3,31,42,35,1.8,5).map(q=>P(1.1,q.u,q.v))),"nf sil hi");
  for (let i=0;i<3;i++) block(intake,-22+i*2,7+i,-4+i*2,36+i,40+i*2,41+i*2,2);
  block(root,69,-3,80,5,30,71,3);
  // Receiving tray: back and floor precede its contents, front hides them.
  const tray = mk("g",{},root), outer = rrect(150,-3,199,52,5,6), inner = rrect(153,0,196,49,3,6);
  line(tray,poly(hull(ringAt(P,outer,0).concat(ringAt(P,outer,22)))),"sil");
  line(tray,poly(ringAt(P,inner,22)),"nf lo");
  line(tray,poly(ringAt(P,rrect(154,1,195,48,3,6),3)),"lo");
  for(let i=0;i<4;i++) block(tray,157+(i%2)*2,9+(i%3),187+(i%2)*2,40+(i%3),4+i*2,5+i*2,2);
  const moving = mk("g",{},root), cards = [];
  for(let i=0;i<5;i++) {
    const g=mk("g",{},moving), body=solid(g), marks=line(g,"");
    cards.push({g,body,marks,x:0});
  }
  // The intake's opaque hood masks each card until it emerges from the slot.
  root.appendChild(intake);
  const LR = pts => pts[0][0] <= pts[pts.length-1][0] ? pts : pts.slice().reverse();
  const iF=LR(ringAt(P,run(inner,front),22)), oT=LR(ringAt(P,run(outer,front),22)), oB=LR(ringAt(P,run(outer,front),0));
  const near=mk("g",{},root);
  line(near,poly([...iF,oT[oT.length-1],...oB.slice().reverse(),oT[0]]),"fo");
  const rim=line(near,open(iF),"nf sil");
  line(near,open(oT),"nf lo");
  line(near,open([oT[0],...oB,oT[oT.length-1]]),"nf sil");
  line(near,poly(rrect(164,7,183,13,2.5,5).map(q=>P(q.u,52,q.v))),"nf lo");
  // Rounded processing arch with its real sensor slit.
  const gate=mk("g",{},root);
  const post=block(gate,69,43,80,51,30,71,3);
  const lintel=block(gate,67,-5,82,53,66,76,4);
  line(gate,poly(rrect(6,69,40,72,1.4,5).map(q=>P(82,q.u,q.v))),"nf lo");
  const stations=[P(-9,23,39),P(75,24,61),P(175,25,16)];
  const names=["01 · 采集","02 · 解析","03 · 入库"];
  let active=-1, speed=value, phase=19, last=-1;
  const rate=spring(speed);
  let proximity=0;
  function highlight(a) {
    mouth.classList.toggle("hi",a===0 || a<0);
    post.sil.classList.toggle("hi",a===1); lintel.sil.classList.toggle("hi",a===1);
    rim.classList.toggle("hi",a===2);
    read.textContent=a<0 ? "rest" : names[a];
  }
  function draw() {
    if(last===phase) return;
    last=phase;
    cards.forEach((cd,i)=>{
      const x=((phase+i*38)%190)-18, z=31-clamp((x-143)/29,0,1)*19;
      cd.x=x;
      const y=10+(i%2)*2, [ring,inside]=rings(x,y,x+24,y+27,2.4,0.7);
      put(cd.body,prism(P,front,ring,inside,z,z+1.1));
      cd.marks.setAttribute("d",[7,13,19].map((dy,k)=>seg(P(x+5,y+dy,z+1.15),P(x+19-k*2,y+dy,z+1.15))).join(""));
    });
    cards.slice().sort((a,b)=>a.x-b.x).forEach(cd=>moving.appendChild(cd.g));
  }
  const clock=register(stage,(dt)=>{
    const changing=stepS(rate,dt);
    if(!reducedMotion()) phase=(phase+Math.min(dt,0.05)*rate.x)%190;
    draw();
    return !reducedMotion() || changing;
  });
  bag.add(clock.unregister);
  function move(p) {
    let best=Infinity, a=-1;
    stations.forEach((q,i)=>{
      const d=Math.hypot((p[0]-q[0])/52,(p[1]-q[1])/48);
      if(d<best){best=d;a=i;}
    });
    if(best>1.2)a=-1;
    proximity=a<0?0:1-clamp(best/1.2,0,1);
    rate.t=speed*(1-0.91*proximity);
    if(a!==active){active=a;highlight(a);}
    clock.wake();
  }
  bag.add(pointer(stage,{move,leave:()=>{
    active=-1;proximity=0;rate.t=speed;highlight(-1);clock.wake();
  }}));
  bag.add(()=>svg.replaceChildren());
  highlight(-1);draw();clock.wake();
  return {set(v){speed=v;rate.t=speed*(1-0.91*proximity);clock.wake();},destroy:bag.dispose};
}

hairline({
  name:"log-conveyor",
  means:"日志化作纸卡，从采集口经过解析闸门，落入存储槽；悬停放慢传送，滑杆调节流速，按 play 演示采集、解析、入库。",
  rules:[1,3,4,6,7,8,9,10],
  range:[8,18,32],
  tour:[[93,80],[189,98],[305,222],null],
  mount,
});
