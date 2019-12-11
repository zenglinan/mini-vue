export function isPlainObject(obj){
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isArray(arr){
  return Array.isArray(arr)
}

export function isString(str){
  return typeof str === 'string'
}

export function isElement(node){  // dom 元素
  return node.nodeType === 1
}

export function isInterpolation(node){  // 插值表达式
  return node.nodeType === 3 && /\{\{.*\}\}/.test(node.textContent)
}

export function isDirective(attr){  // v- 指令
  return /^v-[A-Za-z]+/.test(attr)
}