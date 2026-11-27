import*as m from"three";import*as b from"three";import*as c from"three";var le=new c.Color(3072906);function ce(e){return e.transparent=!0,e.depthWrite=!1,e.blending=c.CustomBlending,e.blendEquation=c.AddEquation,e.blendSrc=c.OneFactor,e.blendDst=c.OneFactor,e.blendSrcAlpha=c.OneFactor,e.blendDstAlpha=c.OneMinusSrcAlphaFactor,e}function xe(e){return e.transparent=!0,e.depthWrite=!1,e.blending=c.CustomBlending,e.blendEquation=c.AddEquation,e.blendSrc=c.OneFactor,e.blendDst=c.OneMinusSrcAlphaFactor,e.blendSrcAlpha=c.OneFactor,e.blendDstAlpha=c.OneMinusSrcAlphaFactor,e}var _e=`
  #include <colorspace_fragment>
  gl_FragColor.rgb = min(gl_FragColor.rgb, vec3(1.0)) * gl_FragColor.a;
`,ue=`
  uniform vec2 uSize;
  uniform float uRot;
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float c = cos(uRot), s = sin(uRot);
    float sc = length(modelMatrix[0].xyz); // acompanha a escala do objeto (ex.: nave)
    vec2 p = position.xy * uSize * sc;
    mv.xy += vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;function we(e,t,o,a=2.2){let d=ce(new c.ShaderMaterial({uniforms:{uSize:{value:new c.Vector2(e,e)},uRot:{value:0},uColor:{value:t.clone()},uIntensity:{value:o},uSoftness:{value:a}},vertexShader:ue,fragmentShader:`
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uSoftness;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float a = pow(max(0.0, 1.0 - d), uSoftness) * uIntensity;
          float core = pow(max(0.0, 1.0 - d * 1.8), 3.0) * uIntensity;
          gl_FragColor = vec4(mix(uColor, vec3(1.0), clamp(core * 0.6, 0.0, 1.0)), clamp(a, 0.0, 1.0));
          ${_e}
        }
      `})),n=new c.Mesh(new c.PlaneGeometry(1,1),d);return n.frustumCulled=!1,n.renderOrder=5,n}var He=["cumulus-a","cumulus-b","puff","tower","bank","wisp"];async function Se(e,t){let o=new b.TextureLoader,a=t.capabilities.getMaxAnisotropy();return(await Promise.all(He.map(n=>o.loadAsync(`${e}clouds/${n}.webp`)))).map((n,i)=>{n.colorSpace=b.SRGBColorSpace,n.anisotropy=Math.min(4,a);let p=n.image;return{name:He[i],texture:n,aspect:p.width/p.height}})}function Ie(e){let t=e>>>0||1;return()=>{t=t+1831565813>>>0;let o=t;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}var Le=new b.PlaneGeometry(1,1);function Me(e,t){let o=new b.Group,a=Ie(t.seed),d=t.sprites?e.filter(f=>t.sprites.includes(f.name)):e,n=[],[i,p]=t.depth;for(let f=0;f<t.count;f++){let r=d[Math.floor(a()*d.length)],H=i+(p-i)*a(),F=.42+.5*((H-i)/Math.max(.001,p-i)),T=xe(new b.ShaderMaterial({uniforms:{map:{value:r.texture},uSize:{value:new b.Vector2(1,1)},uRot:{value:0},uOpacity:{value:t.opacity*(.7+.3*a())},uTint:{value:new b.Color(F,F*1.01,F*1.03)},uFade:{value:new b.Vector2(1.4,4.2)}},vertexShader:ue,fragmentShader:`
          uniform sampler2D map;
          uniform float uOpacity;
          uniform vec3 uTint;
          uniform vec2 uFade;
          varying vec2 vUv;
          varying float vDist;
          void main() {
            vec4 t = texture2D(map, vUv);
            float a = t.a * uOpacity * smoothstep(uFade.x, uFade.y, vDist);
            if (a < 0.004) discard;
            gl_FragColor = vec4(t.rgb * uTint, a);
            #include <colorspace_fragment>
            gl_FragColor.rgb = min(gl_FragColor.rgb, vec3(1.0)) * gl_FragColor.a;
          }
        `})),C=new b.Mesh(Le,T);C.frustumCulled=!1,o.add(C),n.push({mesh:C,nx:a()-.5,ny:a()-.5,z:H,size:t.size[0]+(t.size[1]-t.size[0])*a(),aspect:r.aspect,drift:.04+a()*.08,phase:a()*Math.PI*2,rot:(a()-.5)*.24,spin:(a()-.5)*.01})}let E=10,s=6;function M(f,r){E=f,s=r;for(let H of n){let g=H.size*E;H.mesh.material.uniforms.uSize.value.set(g,g/H.aspect)}}function x(f){for(let r of n){let H=r.nx*t.spread[0]*E+Math.sin(f*r.drift+r.phase)*.35,g=r.ny*t.spread[1]*s+Math.cos(f*r.drift*.7+r.phase)*.08;r.mesh.position.set(H,g,r.z),r.mesh.material.uniforms.uRot.value=r.rot+f*r.spin}}function v(){for(let f of n)f.mesh.material.dispose()}return{group:o,layout:M,update:x,dispose:v}}import*as z from"three";function Ce(e){let t=new z.BufferGeometry,o=new Float32Array(e*3),a=new Float32Array(e),d=new Float32Array(e),n=new Float32Array(e*3);for(let s=0;s<e;s++)a[s]=Math.random()*100,d[s]=.02+Math.random()*.04,n[s*3]=Math.random()-.5,n[s*3+1]=Math.random(),n[s*3+2]=Math.random();t.setAttribute("position",new z.BufferAttribute(o,3)),t.setAttribute("aSeed",new z.BufferAttribute(a,1)),t.setAttribute("aSize",new z.BufferAttribute(d,1));let i=ce(new z.ShaderMaterial({uniforms:{uTime:{value:0},uScale:{value:800},uColor:{value:new z.Color(14542562)}},vertexShader:`
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime;
        uniform float uScale;
        varying float vI;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.05 + aSeed) * 0.25;
          p.y += cos(uTime * 0.04 + aSeed * 1.7) * 0.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = max(0.001, -mv.z);
          gl_PointSize = clamp(aSize * uScale / dist, 1.0, 6.0);
          vI = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + fract(aSeed) * 1.4) + aSeed))) * smoothstep(1.5, 5.0, dist) * 0.45;
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        varying float vI;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float a = (1.0 - d) * vI;
          gl_FragColor = vec4(uColor, a);
          #include <colorspace_fragment>
          gl_FragColor.rgb = min(gl_FragColor.rgb, vec3(1.0)) * gl_FragColor.a;
        }
      `})),p=new z.Points(t,i);p.frustumCulled=!1,p.renderOrder=2;function E(s,M,x){for(let v=0;v<e;v++)o[v*3]=n[v*3]*x*1.3,o[v*3+1]=s+(M-s)*n[v*3+1],o[v*3+2]=-14+n[v*3+2]*19;t.getAttribute("position").needsUpdate=!0}return{points:p,layout:E,update(s){i.uniforms.uTime.value=s},setPointScale(s){i.uniforms.uScale.value=s},dispose(){t.dispose(),i.dispose()}}}import*as R from"three";function Ae(e){let t=new R.Scene;t.background=new R.Color(131843);let o=new R.PlaneGeometry(1,1),a=[],d=(p,E,s,M,x)=>{let v=new R.Color(p).multiplyScalar(E),f=new R.MeshBasicMaterial({color:v,side:R.DoubleSide,toneMapped:!1});a.push(f);let r=new R.Mesh(o,f);r.scale.set(s,M,1),r.position.set(...x),r.lookAt(0,0,0),t.add(r)};d(16777215,5,9,2.6,[0,7,1.5]),d(14411519,2.4,2.2,9,[-8,1,2.5]),d(16777215,1.7,2.2,9,[8,.5,-1.5]),d(3072906,2.6,14,.7,[0,-1.2,-7]),d(3072906,1.2,6,.5,[-5,-2.5,5]),d(16777215,.45,14,3,[0,-7,0]),d(16777215,2.2,1.2,1.2,[3,4,6]);let n=new R.PMREMGenerator(e),i=n.fromScene(t,.03);return n.dispose(),o.dispose(),a.forEach(p=>p.dispose()),i.texture}import*as u from"three";var Pe=3.38,S=(e,t)=>new u.Vector2(e,t);function Ge(){let e=document.createElement("canvas");e.width=4,e.height=256;let t=e.getContext("2d"),o=t.createLinearGradient(0,0,0,256);o.addColorStop(0,"#000000"),o.addColorStop(.7,"#020806"),o.addColorStop(1,"#0f4a2d"),t.fillStyle=o,t.fillRect(0,0,4,256);let a=new u.CanvasTexture(e);return a.colorSpace=u.SRGBColorSpace,a}function Be(){return new u.SplineCurve([S(.001,-.205),S(.45,-.198),S(.85,-.172),S(1.22,-.118),S(1.5,-.062),S(1.655,-.02),S(1.69,0),S(1.66,.02),S(1.48,.062),S(1.15,.112),S(.85,.148),S(.64,.166),S(.001,.172)]).getPoints(120)}function ze(e,t){let o=new u.Group;o.name="ufo";let a=new u.Group;o.add(a);let d=[],n=g=>(d.push(g),g),i=t?96:160,p=(g,F)=>{n(g);let T=new u.Mesh(g,F);return a.add(T),T},E=n(new u.MeshPhysicalMaterial({color:14672870,metalness:1,roughness:.17,clearcoat:.6,clearcoatRoughness:.08,envMap:e,envMapIntensity:1.15})),s=n(Ge()),M=n(new u.MeshPhysicalMaterial({color:263942,metalness:.1,roughness:.04,clearcoat:1,clearcoatRoughness:.02,envMap:e,envMapIntensity:1.7,emissive:16777215,emissiveMap:s,emissiveIntensity:.45})),x=n(new u.MeshBasicMaterial({color:le.clone().multiplyScalar(1.8),toneMapped:!1}));p(new u.LatheGeometry(Be(),i),E);let v=new u.SphereGeometry(.62,t?48:72,24,0,Math.PI*2,0,Math.PI/2);v.scale(1,.52,1),v.translate(0,.168,0),p(v,M);let f=new u.TorusGeometry(1.692,.0075,8,i*2);f.rotateX(Math.PI/2),p(f,x);let r=we(2.8,le,.2,2.6);r.position.set(0,-.3,0),n(r.geometry),n(r.material),o.add(r);function H(g,F,T){a.rotation.y+=F*(.22+T.spin);let C=.9+.1*Math.sin(g*1.6);r.material.uniforms.uIntensity.value=(.14+.22*T.beam)*C*T.lights,M.emissiveIntensity=.38+.1*Math.sin(g*1.2)}return{root:o,update:H,setPointScale:()=>{},dispose:()=>d.forEach(g=>g.dispose())}}var Q=35,Z=10,Oe=e=>e<0?0:e>1?1:e,de=(e,t,o)=>Oe((e-t)/(o-t||1)),Ue=e=>e*e*(3-2*e),De=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2;async function Ke(e){let{canvas:t,reducedMotion:o}=e,a=window.matchMedia("(pointer: coarse)").matches,d=window.__AUGE_CAPTURE__,n=!d&&(a||window.innerWidth<820||(navigator.hardwareConcurrency||8)<=4),i=new m.WebGLRenderer({canvas:t,alpha:!0,antialias:!n,powerPreference:"high-performance"});i.setClearColor(0,0),i.outputColorSpace=m.SRGBColorSpace,i.toneMapping=m.ACESFilmicToneMapping,i.toneMappingExposure=1.05;let p=d?.dpr??Math.min(window.devicePixelRatio||1,n?1.5:1.75),E=p;i.setPixelRatio(E);let s=new m.Scene,M=Ae(i);s.environment=M;let x=new m.PerspectiveCamera(Q,1,.1,250);x.position.set(0,0,Z);let v=new m.DirectionalLight(16777215,1.4);v.position.set(-4,7,9);let f=new m.DirectionalLight(3072906,.8);f.position.set(5,-2,-6),s.add(v,f);let r=ze(M,n);s.add(r.root);let H=await Se(e.assetsBase,i),F=Object.entries({"clouds-hero":{count:n?11:17,seed:11,depth:[-8,2.2],size:[.22,.44],spread:[1.55,.2],opacity:.96},"clouds-mid":{count:n?8:13,seed:29,depth:[-3,1.2],size:[.2,.4],spread:[1.6,.18],opacity:.86},"clouds-footer":{count:n?10:16,seed:47,depth:[-3,.5],size:[.26,.42],spread:[1.7,.18],opacity:.92}}).map(([l,y])=>{let w=Me(H,y);return s.add(w.group),{anchor:l,layer:w}}),T=n?null:Ce(240);T&&s.add(T.points);let C=1,A=1,O=.01,W=1,B=1,D=new Map,V={},me=l=>(l-C/2)*O,J=l=>-l*O,q=l=>{if(!l)return;let y=l.getBoundingClientRect(),w=window.scrollY;return{cx:y.left+y.width/2,cy:y.top+w+y.height/2,w:y.width,h:y.height,top:y.top+w,bottom:y.bottom+w}};function K(){C=t.clientWidth||window.innerWidth,A=t.clientHeight||window.innerHeight,B=2*Z*Math.tan(m.MathUtils.degToRad(Q/2)),O=B/A,W=C*O,x.aspect=C/A,x.updateProjectionMatrix(),i.setSize(C,A,!1),D.clear(),document.querySelectorAll("[data-anchor]").forEach(_=>{let L=q(_);L&&_.dataset.anchor&&D.set(_.dataset.anchor,L)}),V.hero=q(document.getElementById("inicio")),V.contact=q(document.getElementById("contato")),V.footer=q(document.querySelector("footer"));let y=i.getDrawingBufferSize(new m.Vector2).y/(2*Math.tan(m.MathUtils.degToRad(Q/2)));r.setPointScale(y),T?.setPointScale(y);let w=Math.max(W,B*.85);for(let{anchor:_,layer:L}of F){let G=D.get(_);L.group.userData.active=!!G,G&&(L.group.position.set(me(G.cx),J(G.cy),0),L.layout(w,B))}T?.layout(B,-document.documentElement.scrollHeight*O,W)}let ee=!1,k=()=>{ee||(ee=!0,requestAnimationFrame(()=>{ee=!1,K()}))},pe=new ResizeObserver(k);pe.observe(document.body),window.addEventListener("resize",k),document.fonts?.ready.then(k).catch(()=>{}),K();let P={x:0,y:0,sx:0,sy:0},fe=l=>{l.pointerType==="mouse"&&(P.x=l.clientX/C*2-1,P.y=-(l.clientY/A*2-1))};o||window.addEventListener("pointermove",fe,{passive:!0});let U=new m.Vector3,Fe=new m.Vector3,N=performance.now()/1e3,j=16,Ee=N,te=!0,ve=-1;function he(){let l=performance.now()/1e3,y=Math.min(.05,Math.max(0,l-N));N=l;let w=o?0:l,_=e.getScroll();if(o&&!te&&Math.abs(_-ve)<.5)return;ve=_;let L=-(_+A/2)*O;P.sx+=(P.x-P.sx)*.045,P.sy+=(P.y-P.sy)*.045,x.position.set(P.sx*.25,L+P.sy*.14,Z);let G=!1,Te=0,ie=0,se=0,X=1,$=D.get("ufo-hero");if($){let h=V.hero?V.hero.bottom:A,I=De(de(_,A*.04,Math.max(A*.5,h-A*.28)));I<1&&(G=!0,X=$.w*O/Pe,U.set(me($.cx),J($.cy),0),U.lerp(Fe.set(U.x+W*.45,L+B*1.8,-16),I),Te=(1-Ue(de(I,0,.3)))*(a?.75:1),ie=I*2.4,se=-Math.sin(I*Math.PI)*.5)}let Y=D.get("clouds-mid");if(!G&&Y&&!o){let h=de(_,Y.cy-A*1.15,Y.cy+A*.15);if(h>0&&h<1){G=!0,X=1;let I=-24,Re=(Z-I)*Math.tan(m.MathUtils.degToRad(Q/2))*x.aspect;U.set(-Re*1.25+Re*2.5*h,J(Y.cy)+B*.45+Math.sin(h*Math.PI)*1.2,I),ie=1.6,se=-.28}}if(r.root.visible=G,G){let h=Math.sin(w*1.15)*.05*X;r.root.position.set(U.x,U.y+h,U.z),r.root.scale.setScalar(X),r.root.rotation.set(.2+Math.sin(w*.7)*.03+P.sy*.06,0,se-P.sx*.08),r.update(w,o?0:y,{beam:Te,spin:ie,lights:1})}for(let{layer:h}of F){let I=!!h.group.userData.active&&Math.abs(h.group.position.y-L)<B*2.2;h.group.visible=I,I&&h.update(w)}if(T?.update(w),i.render(s,x),te&&(te=!1,e.onFirstFrame?.()),j=j*.94+y*1e3*.06,!d&&l-Ee>2.5){Ee=l;let h=E;j>26&&E>.75?h=Math.max(.75,E-.25):j<13&&E<p&&(h=Math.min(p,E+.25)),h!==E&&(E=h,i.setPixelRatio(E),K())}}let oe=!1,ne=null,re=0;function ge(){if(!oe)if(oe=!0,N=performance.now()/1e3,e.subscribe)ne=e.subscribe(he);else{let l=()=>{he(),re=requestAnimationFrame(l)};re=requestAnimationFrame(l)}}function ae(){oe=!1,ne?.(),ne=null,cancelAnimationFrame(re)}let be=()=>document.hidden?ae():ge();document.addEventListener("visibilitychange",be);let ye=l=>{l.preventDefault(),ae(),document.documentElement.classList.remove("scene-ready")};return t.addEventListener("webglcontextlost",ye),ge(),{measure:k,dispose(){ae(),pe.disconnect(),window.removeEventListener("resize",k),window.removeEventListener("pointermove",fe),document.removeEventListener("visibilitychange",be),t.removeEventListener("webglcontextlost",ye),r.dispose(),F.forEach(({layer:l})=>l.dispose()),T?.dispose(),H.forEach(l=>l.texture.dispose()),M.dispose(),i.dispose()}}}export{Ke as createScene};
