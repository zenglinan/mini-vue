import {isPlainObject, isArray} from "./utils/type_assert";

export function observe(data){
  if(!isPlainObject(data) && isArray(data)) return

  if(isArray(data)){
    defineArrayReactive(data)
  } else if(isPlainObject(data)){
    Object.keys(data).forEach(k => {
      defineObjectReactive(data, k)
    })
  }
}

function defineObjectReactive(obj, key){
  if(isPlainObject(obj[key])) observe(obj[key]) // 递归调用，observer 所有属性

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get(){
      return obj[key]
    },
    set(newVal){
      if(obj[key] === newVal){
        return
      }
      // 如果新值是 对象/数组 也要对其进行响应式定义
      if(isPlainObject(newVal) || isArray(newVal)){
        observe(newVal)
      }
      // update()
      obj[key] = newVal
    }
  })
}

function defineArrayReactive(arr){
  const arrayReactivePrototype = Object.create(Array.prototype) // 创建一个新的 Array 的原型
  const reactiveMethods = ['pop', 'push', 'shift', 'unshift', 'sort', 'splice', 'reverse']

  reactiveMethods.forEach(m => {
    // 重写数组方法，每个方法底层除了调用原方法，还加入了更新函数
    arrayReactivePrototype[m] = function(){
      // update
      Array.prototype[m].apply(this, arguments)
    }
  })

  // 修改数组原型: arr -> arrayReactivePrototype -> Array.prototype
  Object.setPrototypeOf(arr, arrayReactivePrototype)

  // 遍历，对数组元素递归调用该方法改变原型
  arr.forEach(item => {
    isArray(item) && defineArrayReactive(item)
  })
}