import { definitions } from './definitions.js'
export const colorRecipes = definitions.colorRecipes
export function resolveTokens({skin='console',mode='light',density='comfortable',palette='default',design,font,headingFont,motion}={}) {
  if(!Object.hasOwn(definitions.skins,skin)) throw new TypeError('Unknown UI skin')
  if(!['light','dark'].includes(mode)||!['comfortable','compact'].includes(density)) throw new TypeError('Unknown UI mode or density')
  const family=definitions.skins[skin]
  if(!Object.hasOwn(definitions.palettes,palette)) throw new TypeError('Unknown UI palette')
  const colors=definitions.palettes[palette]
  const categories=Object.fromEntries(Object.entries(definitions.categories).flatMap(([name,modes])=>Object.entries(modes[mode]).map(([role,value])=>[`category-${name}-${role}`,value])))
  for(const [key,value] of [["designs",design],["fonts",font],["fonts",headingFont],["motions",motion]]) if(value!==undefined&&!Object.hasOwn(definitions[key],value)) throw new TypeError(`Unknown UI ${key}`)
  return {...definitions.base,...(mode==='dark'?definitions.dark:{}),...family.base,...(mode==='dark'?family.dark:{}),...(density==='compact'?definitions.compact:{}),...colors.base,...(mode==='dark'?colors.dark:{}),...categories,...definitions.designs[design],...(font?{'font-sans':definitions.fonts[font].family}:{}),...(headingFont?{'font-heading':definitions.fonts[headingFont].family}:{}),...definitions.motions[motion]}
}
export function getNativeTokens(options={}) {
  const t=resolveTokens(options)
  const scale=Math.max(1,Math.min(1.2,Number.isFinite(options.scale)?options.scale:1))
  const colors={}
  for(const key of ['canvas','surface','raised','soft','text','muted','border','input-border','accent','on-accent','accent-soft','info','info-soft','success','success-soft','warning','warning-soft','danger','danger-soft','backdrop',...Object.keys(t).filter(key=>key.startsWith('category-'))]) colors[key]=t[key]
  return {
    colors,
    radii:{control:parseFloat(t.radius),panel:parseFloat(t['panel-radius'])},
    spacing:[1,2,3,4,6,8].map(step=>parseFloat(t[`space-${step}`])),
    typography:{body:parseFloat(t['font-base'])*scale,caption:parseFloat(t['font-caption'])*scale,title:parseFloat(t['font-title'])*scale},
    sizes:{controlMinHeight:Math.max(44,parseFloat(t.control)),rowMinHeight:Math.max(44,parseFloat(t.row)),inset:parseFloat(t.inset)},
    motionMs:{fast:options.reducedMotion?0:parseFloat(t.fast),normal:options.reducedMotion?0:parseFloat(t.normal),enter:options.reducedMotion?0:parseFloat(t.enter)}
  }
}
