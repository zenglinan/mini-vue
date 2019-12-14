import {eachObj} from './utils/eachObj'
import {installModule, ModuleCollection} from "./module";

let Vue

class Store{
  constructor(options){
    this._state = new Vue({ // 将 state 存入 Vue 实例的 data 中，以实现响应式数据
      data: { state: options.state }
    })
    this.getters = {}
    this.mutations = {}
    this.actions = {}
    // this.modules = new ModuleCollection(options);  // 进行模块收集，形成一颗树
    let modules = options
    installModule(Vue, this, this.state, [], modules)
  }

  commit = (type, payload) => { // 箭头函数，保证 this 指向当前 store 实例
    // 逐个执行 mutations
    eachObj(this.mutations[type], (k, fn) => {
      fn(payload)
    })
  }
  dispatch = (type, payload) => {
    return new Promise((resolve, reject) => {
      try{
        resolve(
            eachObj(this.actions[type], (k, fn) => {
              fn(payload)
            })
        )
      } catch (e){
        reject(e)
      }
    })
  }

  get state(){
    return this._state.state // 不直接暴露出 $store.state，通过访问器的形式暴露访问，保证 state 无法被直接修改
  }
}

function install(_Vue){
  if(Vue) throw new Error('Vuex instance can only exist one!')
  Vue = _Vue
  // 将 vm.$options.$store 注入到每个子组件的 vm.$store 中
  Vue.mixin({
    beforeCreate() {
      if(this.$options && this.$options.store){
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  install,
  Store
}
