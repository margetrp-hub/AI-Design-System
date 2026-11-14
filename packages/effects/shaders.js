// Rays extracted from our original public-light-rays.js. Grid is a new single-plane
// projection, not the old admin shader or a ReactBits port. See README provenance.
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
 vec2 screen=gl_FragCoord.xy/resolution;
 float horizon=.61+(pointer.y-.5)*.04;
 float ground=max(horizon-screen.y,.002);
 float depth=.20/ground;
 vec2 cell=vec2((screen.x-.5+(pointer.x-.5)*.035)*depth*8.,depth*2.5-time*.22);
 vec2 edge=abs(fract(cell+.5)-.5);
 float width=clamp(depth/resolution.y*5.,.012,.15);
 float lines=1.-smoothstep(width,width*2.,min(edge.x,edge.y));
 float visible=smoothstep(.012,.13,ground)*smoothstep(0.,.12,screen.y);
 float band=pow(max(0.,cos(depth*.65-time*.7)),24.);
 vec3 groundColor=tint*(lines*.32+band*.20)*visible;
 float glow=exp(-abs(screen.y-horizon)*20.)*.12;
 gl_FragColor=vec4((groundColor+tint*glow)*intensity,1.);
}`;
