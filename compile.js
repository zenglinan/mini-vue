import { isString, isElement, isInterpolation, isDirective } from "./utils/type_assert.js"
import { getOuterHtml } from './utils/get_outerhtml.js'
import {directives} from './directives.js'
import { Watcher } from './Watcher.js'

class Compile{
  constructor(vm, el){
    this.$vm = vm
    el = isString(el)
        ? document.querySelector(el)
        : el
    // 获取 el 的 outerHTML (type: string)进行编译
    this.compileTemp(el)
  }

  compileTemp(temp){ // 编译模板
    const childNodes = temp.childNodes
    
    Array.from(childNodes).forEach(node => {
      if(isElement(node)){
        this.compileEle(node)
      } else if(isInterpolation(node)){
        this.compileInterpolation(node)
      }
  
      if(node.childNodes.length && node.childNodes.length > 2){ // 递归遍历
        this.compileTemp(node)
      }
    })
  }

  compileEle(el){
    // 遍历 dom 元素的属性，取出指令，执行相关指令方法
    const attrs = el.attributes
    Array.from(attrs).map(attr => {
      if(isDirective(attr.name)){
        const exp = attr.value
        const dir = attr.name.slice(2)
        const handler = directives[`${dir}Updater`] // 获取对应的指令函数

        if(handler){
          handler(this.$vm, el, exp)
          // this.$vm[exp] && new Watcher(this.$vm, exp)
        }
      }
    })
  }

  compileInterpolation(){

  }
}

export default Compile


