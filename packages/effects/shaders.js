// Rays and the four-plane tunnel use the maintainer's original entry-page geometry.
// Particle projection shares the original five-shape coordinates, without a 3D dependency.
export const vertex =
  "attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}";
export const rays = `precision highp float;
uniform float time;uniform vec2 resolution;uniform vec2 pointer;uniform vec3 tint;uniform float intensity;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float ray(vec2 source,vec2 direction,vec2 point,float seed,float speed){
 vec2 delta=point-source;float distanceToSource=length(delta);
 float spread=pow(max(dot(normalize(delta+vec2(.0001)),direction),0.0),8.0);
 float fade=clamp((resolution.y*1.45-distanceToSource)/(resolution.y*1.45),0.0,1.0);
 return spread*fade*(.72+.28*sin(time*speed+seed+distanceToSource*.012));
}
void main(){
 vec2 pixel=vec2(gl_FragCoord.x,resolution.y-gl_FragCoord.y);
 vec2 source=vec2(resolution.x*.52,-resolution.y*.18);
 vec2 direction=normalize(mix(vec2(0.,1.),normalize(pointer*resolution-source),.10));
 float beam=ray(source,direction,pixel,1.7,.65)+ray(source+vec2(70.,0.),direction,pixel,3.2,.42)*.72+ray(source-vec2(90.,0.),direction,pixel,5.8,.31)*.58;
 float brightness=.35+.65*(1.-pixel.y/max(resolution.y,1.));
 vec3 color=tint*beam*brightness+vec3(.08,.25,.34)*beam*.55+(hash(pixel*.035+time*.02)-.5)*.025;
 gl_FragColor=vec4(max(color,vec3(0.)),clamp(beam*.52,0.,.42)*intensity);
}`;
export const grid = `precision highp float;
uniform float time;uniform vec2 resolution;uniform vec2 pointer;uniform vec3 tint;uniform float intensity;
void main(){
 vec2 screen=(2.*gl_FragCoord.xy-resolution)/resolution.y;
 vec3 direction=normalize(vec3(screen,2.));
 direction.xy+=(pointer-.5)*vec2(.12,-.18)*direction.z;
 // Intersect both side walls and the floor/ceiling, selecting the nearest plane.
 float wall=.5/max(abs(direction.x),.0001);
 float floorCeiling=.2/max(abs(direction.y),.0001);
 float distanceToPlane=min(wall,floorCeiling);
 vec3 hit=direction*distanceToPlane;
 vec2 cell=(wall<floorCeiling?hit.zy:hit.xz)*10.;
 vec2 edge=min(fract(cell),1.-fract(cell));
 float lines=1.-smoothstep(0.,.035,min(edge.x,edge.y));
 float fade=exp(-distanceToPlane*2.);
 float scanZ=(1.-abs(mod(time+.65,4.)-2.)/2.)*2.;
 float dz=hit.z-scanZ;
 float scan=exp(-.5*dz*dz/.0324)+exp(-.5*dz*dz/.1296)*.25;
 vec3 color=vec3(.184,.161,.227)*lines*fade+tint*scan*.72;
 gl_FragColor=vec4(color*intensity,1.);
}`;

export const particleVertex = `precision highp float;
attribute vec3 shape0;attribute vec3 shape1;attribute vec3 shape2;attribute vec3 shape3;attribute vec3 shape4;
uniform vec2 resolution;uniform vec2 pointer;uniform float time;uniform float progress;
void main(){
 float phase=clamp(progress,0.,1.)*4.;
 float blend=smoothstep(0.,1.,fract(phase));
 vec3 p;
 if(phase<1.) p=mix(shape0,shape1,blend);
 else if(phase<2.) p=mix(shape1,shape2,blend);
 else if(phase<3.) p=mix(shape2,shape3,blend);
 else p=mix(shape3,shape4,smoothstep(0.,1.,phase-3.));
 float yaw=(pointer.x-.5)*.056;
 p.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*p.xz;
 float pitch=(pointer.y-.5)*.056;
 p.yz=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch))*p.yz;
 p*=1.25*(1.+sin(time*.96)*.018);
 p.y-=.7;
 p.xy-=(pointer-.5)*vec2(.36,-.24);
 float depth=9.2-p.z;
 float focal=1.6003;
 gl_Position=vec4(p.x*focal/(resolution.x/resolution.y),p.y*focal,0.,depth);
 gl_PointSize=clamp(.033*resolution.y*.5/depth,1.,4.);
}`;
export const particleFragment = `precision mediump float;
uniform vec3 tint;uniform float intensity;
void main(){
 float radius=length(gl_PointCoord-.5)*2.;
 if(radius>1.) discard;
 gl_FragColor=vec4(tint,(1.-smoothstep(.45,1.,radius))*.84*intensity);
}`;
