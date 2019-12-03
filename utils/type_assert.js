export function isPlainObject(obj){
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isArray(arr){
  return Array.isArray(arr)
}

export function isString(str){
  return typeof str === 'string'
}