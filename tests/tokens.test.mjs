import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTokens, getNativeTokens } from '../packages/tokens/runtime.js'
import { definitions } from '../packages/tokens/definitions.js'
function luminance(hex) {const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
function contrast(a,b) {const [light,dark]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (light+.05)/(dark+.05)}
test('every skin, palette and appearance retains readable text and controls',()=>{
  for(const skin of Object.keys(definitions.skins)) for(const palette of Object.keys(definitions.palettes)) for(const mode of ['light','dark']) {
    const t=resolveTokens({skin,mode,palette})
    for(const surface of ['canvas','surface','soft','raised']) for(const text of ['text','muted']) assert.ok(contrast(t[text],t[surface])>=4.5,`${skin}/${mode} ${text}/${surface}`)
    assert.ok(contrast(t.accent,t['on-accent'])>=4.5,`${skin}/${mode} primary`)
    for(const state of ['info','success','warning','danger']) assert.ok(contrast(t[state],t[state+'-soft'])>=4.5,`${skin}/${mode} ${state}`)
    assert.ok(contrast(t['input-border'],t.surface)>=3,`${skin}/${mode} input boundary`)
  }
})

test('category text and progress retain contrast in every theme without changing semantic status colors',()=>{
  for(const skin of Object.keys(definitions.skins)) for(const palette of Object.keys(definitions.palettes)) for(const mode of ['light','dark']) {
    const t=resolveTokens({skin,mode,palette})
    for(const name of Object.keys(definitions.categories)) {
      const category=definitions.categories[name][mode]
      assert.equal(t[`category-${name}-ink`],category.ink)
      for(const bg of [category.soft,t.canvas,t.surface,t.soft,t.raised]) assert.ok(contrast(category.ink,bg)>=4.5,`${skin}/${palette}/${mode}/${name} text`)
      assert.ok(contrast(category.solid,category.soft)>=3,`${mode}/${name} progress`)
      assert.equal(getNativeTokens({skin,mode,palette}).colors[`category-${name}-ink`],category.ink)
    }
    assert.equal(t.danger,mode==='dark'?definitions.dark.danger:definitions.base.danger)
  }
})
test('native mapping stays numeric, touch sized, scales type without shrinking layout and reduces motion',()=>{
  const base=getNativeTokens({skin:'clinical',mode:'dark',density:'compact'})
  const scaled=getNativeTokens({skin:'clinical',mode:'dark',density:'compact',scale:1.2,reducedMotion:true})
  assert.equal(base.sizes.controlMinHeight,44);assert.equal(base.typography.body,15);assert.equal(scaled.typography.body,18)
  assert.deepEqual(base.sizes,scaled.sizes);assert.deepEqual(scaled.motionMs,{fast:0,normal:0,enter:0})
  assert.equal(scaled.colors.accent,resolveTokens({skin:'clinical',mode:'dark'}).accent)
  assert.equal('shadow' in scaled,false);assert.throws(()=>resolveTokens({skin:'unknown'}))
})

test('visual languages, fonts and motion resolve independently of palette and retain native geometry',()=>{
 const base=resolveTokens({palette:'jade'})
 for(const design of Object.keys(definitions.designs)){
  const t=resolveTokens({palette:'jade',design,font:'wenkai',headingFont:'fraunces',motion:'none'})
  assert.equal(t.accent,base.accent);assert.equal(t.danger,base.danger)
  assert.equal(t['font-sans'],definitions.fonts.wenkai.family);assert.equal(t.fast,'0ms')
  assert.equal(getNativeTokens({design}).radii.panel,parseFloat(t['panel-radius']))
 }
 assert.throws(()=>resolveTokens({design:'imaginary'}));assert.throws(()=>resolveTokens({font:'uninstalled'}))
})
