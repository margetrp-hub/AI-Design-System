import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUiTheme } from './theme'
export function useReducedMotion(){
 const theme=useUiTheme(),system=ref(true)
 let media:MediaQueryList|undefined
 const update=()=>{system.value=media?.matches??true}
 onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');update();media.addEventListener('change',update)})
 onUnmounted(()=>media?.removeEventListener('change',update))
 return computed(()=>system.value||theme?.value.motion==='none')
}
