// 存放指令函数

class Directive {
  textUpdater(vm, el, exp){
    console.log(vm)
    if(vm[exp]){
      el.textContent = vm[exp]  // 说明引用的是 vue 实例上的数据
    } else {
      el.textContent = exp  // 说明是 JS 表达式
    }
  }
}


export const directives = new Directive()