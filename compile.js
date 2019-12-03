import {isString} from "./utils/type_assert"

export function compile(el) {
  el = isString(el)
              ? document.querySelector(el)
              : el
  // 获取 el 的 outerHTML (type: string)进行编译
  const template = getOutHtml(el)
  compileTemp(template)
}

function getOutHtml(el){
  const fragment = document.createDocumentFragment()
  fragment.appendChild(el)
  return fragment.innerHTML
}

function compileTemp(temp){ // 编译模板
  // <div></div>

}