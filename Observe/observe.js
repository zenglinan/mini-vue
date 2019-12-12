import {isPlainObject, isArray} from "../utils/type_assert.js";
import Dep from './Dep.js'

export function observe(data){
  if(!isPlainObject(data) && !isArray(data)) return

  if(isArray(data)){
    defineArrayReactive(data)
  } else if(isPlainObject(data)){
    Object.keys(data).forEach(k => {
      defineObjectReactive(data, k, data[k])
    })
  }
}

function defineObjectReactive(obj, key, val){
  if(isPlainObject(val)) observe(val) // 递归调用，observer 所有属性

  const dep = new Dep() // 每个属性对应一个 dep 对象，用于管理观察者 watcher
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get(){
      Dep.target && dep.add(Dep.target) // 将最新的 watcher 添加进这个属性的 dep 中
      return val
    },
    set(newVal){
      if(val === newVal){
        return
      }
      // 如果新值是 对象/数组 也要对其进行响应式定义
      if(isPlainObject(newVal) || isArray(newVal)){
        observe(newVal)
      }
      val = newVal  // 这里注意不能用 obj[key] = newVal 会造成循环调用
      dep.notify()  // 由于形成了闭包，此作用域内依然可以持有上面定义的 dep 的引用
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