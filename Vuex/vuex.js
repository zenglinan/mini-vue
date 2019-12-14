import {eachObj} from './utils/eachObj'

let Vue

function installModule(store, state, path, module) {
  // store.state.a.c.x
  let parent = path.slice(0, -1).reduce((state, cur) => {
    return state[cur]
  }, state)
  Vue.set(parent, path[path.length - 1], module.state)

  let getters = module.getters || {}
  eachObj(getters, (k, fn) => {
    Object.defineProperty(store.getters, k, {
      get(){
        return fn(module.state) // 注意 getters 传入的是当前模块的 getters
      }
    })
  })

  let mutations = module.mutations || {}
  eachObj(mutations, (k, fn) => {
    const rootMut = store.mutations

    if(!rootMut[k]) {
      rootMut[k] = []
    }

    rootMut[k].push((payload)=>fn(module.state, payload))
  })

  let actions = module.actions || {}
  eachObj(actions, (k, fn) => {
    const rootAct = store.actions

    if(!rootAct[k]){
      rootAct[k] = []
    }

    rootAct[k].push((payload)=>fn(store, payload))
  })

  if(module.modules){
    eachObj(module.modules, (modName, mod)=>{
      installModule(store, state, path.concat(modName), mod)
    })
  }
}

class ModuleCollection{
  constructor(options){
    this.register([], options)
  }

  register(path, module){
    let newModule = {
      _raw: module,
      _children: {},
      state: module.state
    }

    if(path.length === 0){  // path 为空说明为根模块
      this.root = newModule
    } else {
      let curMod = path[path.length - 1] // 当前要挂载的模块
      let pareMod =  // 当前要挂载模块的父模块
          path.slice(0, -1).reduce((parent, cur) => {
            return parent._children[cur]
          }, this.root)

      pareMod._children[curMod] = newModule
    }

    if(module.modules){ // 递归注册模块
      eachObj(module.modules, modName => {
        this.register(path.concat(modName), module.modules[modName])  // 假设 b 是 a 的 子模块，path 此时为 [a, b]
      })
    }
  }
}

class Store{
  constructor(options){
    this._state = new Vue({ // 将 state 存入 Vue 实例的 data 中，以实现响应式数据
      data: { state: options.state }
    })
    this.getters = {}
    this.mutations = {}
    this.actions = {}
    this.modules = new ModuleCollection(options);  // 进行模块收集，形成一颗树
    installModule(this, this.state, [], this.modules.root._raw)
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
