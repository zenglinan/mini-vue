import {Watcher} from './Watcher.js'

// 存放指令函数

class Directive {
  textUpdater(vm, el, exp){
    if(vm[exp]){
      el.textContent = vm[exp]  // 说明引用的是 vue 实例上的数据
      new Watcher(vm, exp, ()=>{
        el.textContent = vm[exp]
      })
    } else {
      el.textContent = exp  // 说明是 JS 表达式
    }
  }

  modelUpdater(vm, el, exp){
    if(!vm[exp]) return

    if(el.tagName === 'INPUT'){
      switch (el.type) {
        case 'text': {
          el.value = vm[exp]
          new Watcher(vm, exp, ()=>{
            el.value = vm[exp]
          })

          el.addEventListener('input', (e)=>{
            vm[exp] = e.target.value
          })
        }
      }
    }
  }
}

export const directives = new Directive()