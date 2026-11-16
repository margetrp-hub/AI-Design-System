import { test,expect } from '@playwright/test'
const preview='[data-testid="composition-preview"]'
test('compose, save, reload, export and reject bad imports without losing work',async({page})=>{
 test.setTimeout(60000)
 await page.goto('/#compose')
 await page.getByRole('combobox',{name:'整套方案',exact:true}).selectOption('preset:3')
 await page.getByRole('combobox',{name:'局部卡片造型'}).selectOption('brutalist')
 await page.getByRole('combobox',{name:'标题字体'}).selectOption('wenkai')
 await page.getByRole('combobox',{name:'玻璃质感'}).selectOption('regular')
 await page.getByRole('slider',{name:'玻璃透明度'}).focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight')
 await page.getByRole('textbox',{name:'方案名称'}).fill('透明度与中文标题')
 await page.getByRole('button',{name:'保存搭配',exact:true}).click()
 await page.reload()
 await expect(page.getByRole('textbox',{name:'方案名称'})).toHaveValue('透明度与中文标题')
 await expect(page.getByRole('slider',{name:'玻璃透明度'})).toHaveAttribute('aria-valuenow','1')
 await expect(page.getByRole('combobox',{name:'玻璃质感'})).toHaveValue('regular')
 await page.getByText('导入配置与接入代码',{exact:true}).click()
 await expect(page.locator('.composer-code code')).toContainText('"design": "brutalist"')
 await page.getByRole('textbox',{name:'导入方案 JSON'}).fill('{"version":9}')
 await page.getByRole('button',{name:'应用导入配置'}).click()
 await expect(page.getByText(/导入失败，当前搭配未改变/)).toBeVisible()
 await expect(page.getByRole('textbox',{name:'方案名称'})).toHaveValue('透明度与中文标题')
 const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'导出 JSON'}).click()
 const download=await downloadEvent,stream=await download.createReadStream();const chunks=[];for await(const chunk of stream!)chunks.push(chunk)
 const exported=JSON.parse(Buffer.concat(chunks).toString());expect(exported.theme.transparency).toBe(1);expect(exported.override.design).toBe('brutalist')
 await page.getByRole('button',{name:'重置',exact:true}).click()
 await page.getByRole('textbox',{name:'导入方案 JSON'}).fill(JSON.stringify(exported));await page.getByRole('button',{name:'应用导入配置'}).click()
 await expect(page.getByRole('combobox',{name:'标题字体'})).toHaveValue('wenkai')
 await page.getByRole('combobox',{name:'整套方案',exact:true}).selectOption({label:'我的 · 透明度与中文标题'})
 await expect(page.getByRole('textbox',{name:'方案名称'})).toHaveValue('透明度与中文标题')
 exported.override.material='solid'
 await page.getByRole('textbox',{name:'导入方案 JSON'}).fill(JSON.stringify(exported));await page.getByRole('button',{name:'应用导入配置'}).click()
 await expect(page.locator('.sample-local-override .ui-button')).toHaveCSS('background-color','rgb(253, 254, 254)')
 await expect(page.locator('.sample-local-override .ui-button')).toHaveCSS('backdrop-filter','none')
})
test('storage failure keeps the draft and a retry writes the receipt',async({page})=>{
 await page.goto('/#compose');await page.getByRole('textbox',{name:'方案名称'}).fill('失败恢复方案')
 await page.evaluate(()=>{const original=Storage.prototype.setItem;let failed=false;Storage.prototype.setItem=function(key,value){if(key==='ai-design-system-compositions-v1'&&!failed){failed=true;throw Error('test quota')}return original.call(this,key,value)}})
 await page.getByRole('button',{name:'保存搭配',exact:true}).click();await expect(page.getByText(/未能保存，当前搭配已保留/)).toBeVisible()
 await page.getByRole('button',{name:'重试保存'}).click();await page.reload();await expect(page.getByRole('textbox',{name:'方案名称'})).toHaveValue('失败恢复方案')
})
test('layouts preserve fields and all content stays reachable at small container width',async({page})=>{
 await page.goto('/#compose');await page.getByRole('textbox',{name:'工作室名称',exact:true}).fill('跨布局的草稿')
 for(const size of [1440,800,390]){await page.setViewportSize({width:size,height:950});for(const layout of ['sidebar','topbar','master-detail','workbench','editorial','bento']){
  await page.getByRole('combobox',{name:'页面骨架'}).selectOption(layout)
  await expect(page.getByRole('textbox',{name:'工作室名称',exact:true})).toHaveValue('跨布局的草稿')
  await expect(page.locator('.sample-aside')).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`${size}/${layout}`).toBe(true)
  expect(await page.locator('.ui-layout-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${size}/${layout} content`).toBe(true)
 }}
 await page.getByRole('combobox',{name:'预览字号'}).selectOption('1.2');await page.getByRole('button',{name:'编辑工作室',exact:true}).click()
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'编辑工作室',exact:true})).toBeFocused()
})
test('languages change geometry and hierarchy with the same palette, and local overrides stay local',async({page})=>{
 await page.goto('/#compose');const forms=[]
 for(const design of ['base','brutalist','industrial','glass','editorial','soft','kinetic','geist','carbon','spectrum','atelier','material']){
  const labels:Record<string,string>={base:'静序 · 清晰工作台',brutalist:'硬线 · 新粗犷',industrial:'工造 · 工业仪器',glass:'流璃 · 液态玻璃',editorial:'书页 · 编辑排版',soft:'云塑 · 柔塑拟物',kinetic:'光域 · 数字光场',geist:'墨界 · Vercel 启发',carbon:'格构 · IBM 启发',spectrum:'声场 · Spotify 启发',atelier:'织光 · Stripe 启发',material:'彩阶 · Material 启发'}
  await page.getByRole('group',{name:'视觉语言'}).getByRole('button',{name:labels[design],exact:true}).click()
  forms.push(await page.locator(preview).evaluate(e=>{const s=getComputedStyle(e),h=getComputedStyle(e.querySelector('.ui-surface h2')!);return [s.getPropertyValue('--ui-radius'),s.getPropertyValue('--ui-stroke'),h.fontSize,h.fontWeight].join('/')}))
  await expect(page.getByRole('combobox',{name:'配色方案'})).toHaveValue('cobalt')
 }
 expect(new Set(forms).size).toBeGreaterThanOrEqual(7)
 await page.getByRole('group',{name:'视觉语言'}).getByRole('button',{name:'硬线 · 新粗犷',exact:true}).click();await page.getByRole('combobox',{name:'局部卡片造型'}).selectOption('base')
 await expect(page.locator('.sample-local-override .ui-panel-header')).toHaveCSS('border-bottom-width','1px')
 await expect(page.locator('.composer-preview .ui-surface')).toHaveCSS('border-top-width','2px')
})
test('all typography choices load actual font resources',async({page})=>{
 await page.goto('/#compose')
 for(const [choice,family,sample] of [['geist','Geist Variable','Typography'],['noto-sans','Noto Sans SC Variable','中文设计'],['noto-serif','Noto Serif SC Variable','中文设计'],['plex-mono','IBM Plex Mono','012345'],['manrope','Manrope Variable','Typography'],['space-grotesk','Space Grotesk Variable','Typography'],['fraunces','Fraunces Variable','Typography'],['wenkai','LXGW WenKai','中文设计']]){
  await page.getByRole('combobox',{name:'标题字体'}).selectOption(choice)
  const fonts=await page.evaluate(async({family,sample})=>(await document.fonts.load(`400 24px "${family}"`,sample)).map(f=>({family:f.family,status:f.status})),{family,sample})
  expect(fonts.length,choice).toBeGreaterThan(0);expect(fonts.every(f=>f.status==='loaded')).toBe(true)
 }
})
test('liquid transparency changes surfaces and portals, with refraction and accessible fallback',async({page})=>{
 await page.goto('/#compose');await page.getByRole('combobox',{name:'整套方案',exact:true}).selectOption('preset:3')
 await expect(page.locator('.ui-lens[data-refraction="true"]').first()).toBeAttached()
 const slider=page.getByRole('slider',{name:'玻璃透明度'});await slider.focus();await slider.press('End')
 await expect(page.locator('.ui-layout-content .ui-lens')).toHaveCSS('background-color','color(srgb 0 0 0 / 0)')
 await expect(page.locator('.sample-local-override .ui-panel')).toHaveCSS('background-color','color(srgb 0 0 0 / 0)')
 await slider.press('Home');await expect(page.locator('.ui-layout-content .ui-lens')).toHaveCSS('background-color','color(srgb 0.992157 0.996078 0.996078)')
 await page.getByRole('combobox',{name:'玻璃质感'}).selectOption('regular');await expect(page.locator('.ui-layout-content .ui-lens')).toHaveCSS('backdrop-filter',/blur\(16px\)/)
 await page.getByRole('combobox',{name:'玻璃质感'}).selectOption('clear');await expect(page.locator('.ui-layout-content .ui-lens')).toHaveCSS('backdrop-filter',/blur\(1.5px\)/)
 await page.getByRole('group',{name:'玻璃导航示例'}).getByRole('button',{name:'作品',exact:true}).click();await expect(page.locator('.glass-study-caption strong')).toContainText('作品')
 const background=page.getByRole('slider',{name:'背景位置'});await background.focus();await background.press('End');await expect(background).toHaveAttribute('aria-valuenow','100')
 await page.getByRole('button',{name:'编辑工作室',exact:true}).click();await expect(page.locator('.ui-portal').filter({has:page.getByRole('dialog',{name:'编辑工作室',exact:true})})).toHaveAttribute('data-ui-material','liquid');await page.keyboard.press('Escape')
 await page.emulateMedia({reducedMotion:'reduce'});await slider.focus();await slider.press('End')
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]})
 await expect(page.locator('.ui-lens').first()).toHaveCSS('display','none');await expect(page.locator('.sample-local-override .ui-panel')).toHaveCSS('background-color','rgb(253, 254, 254)')
 await expect(page.locator('.ui-layout-header')).toHaveCSS('background-color','rgb(253, 254, 254)')
})

test('new task layouts retain forms and conversation drafts, with reachable mobile content',async({page})=>{
 await page.goto('/#compose');await page.getByRole('textbox',{name:'工作室名称',exact:true}).fill('跨骨架工作室')
 await page.getByRole('combobox',{name:'预览字号'}).selectOption('1.2')
 for(const width of [1440,800,390]){
  await page.setViewportSize({width,height:950})
  for(const layout of ['settings','split','focused']){
   await page.getByRole('combobox',{name:'页面骨架'}).selectOption(layout)
   await expect(page.getByRole('textbox',{name:'工作室名称',exact:true})).toHaveValue('跨骨架工作室')
   await expect(page.locator('.ui-layout-aside')).toBeVisible()
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true)
  }
 }
 await page.getByRole('combobox',{name:'页面骨架'}).selectOption('conversation')
 await page.getByRole('textbox',{name:'对话草稿',exact:true}).fill('保留这条未提交的草稿')
 await page.locator('.sample-navigation').getByRole('button',{name:'组件研究',exact:true}).click();await expect(page.getByRole('textbox',{name:'对话草稿',exact:true})).toHaveValue('')
 await page.locator('.sample-navigation').getByRole('button',{name:'品牌更新',exact:true}).click();await expect(page.getByRole('textbox',{name:'对话草稿',exact:true})).toHaveValue('保留这条未提交的草稿')
 await page.getByRole('combobox',{name:'页面骨架'}).selectOption('settings');await page.getByRole('combobox',{name:'页面骨架'}).selectOption('conversation')
 await expect(page.getByRole('textbox',{name:'对话草稿',exact:true})).toHaveValue('保留这条未提交的草稿')
 await page.getByRole('button',{name:'添加到本地对话',exact:true}).click()
 await expect(page.locator('.sample-chat-message').last()).toContainText('保留这条未提交的草稿')
 await expect(page.getByRole('button',{name:'添加到本地对话',exact:true})).toBeDisabled()
 for(let i=0;i<5;i++){await page.getByRole('textbox',{name:'对话草稿',exact:true}).fill('长消息检查 '.repeat(30));await page.getByRole('button',{name:'添加到本地对话',exact:true}).click()}
 expect(await page.locator('.ui-layout-content').evaluate(e=>e.scrollHeight>e.clientHeight)).toBe(true)
 await expect(page.locator('.sample-chat-message').last()).toBeInViewport()
 await expect(page.getByRole('textbox',{name:'对话草稿',exact:true})).toBeVisible()
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true)
})
