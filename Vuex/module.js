import {eachObj} from "./utils/eachObj";

export class ModuleCollection{
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

export function installModule(vm, store, state, path, module) {
  // store.state.mod1.x
  let parent = path.slice(0, -1).reduce((state, cur) => {
    return state[cur]
  }, state)
  vm.set(parent, path[path.length - 1], module.state)

  // store.getters.x
  let getters = module.getters || {}
  eachObj(getters, (k, fn) => {
    Object.defineProperty(store.getters, k, {
      get(){
        return fn(module.state) // 注意 getters 传入的是当前模块的 getters
      }
    })
  })

  // store.mutations.x
  let mutations = module.mutations || {}
  eachObj(mutations, (k, fn) => {
    const rootMut = store.mutations

    if(!rootMut[k]) {
      rootMut[k] = []
    }

    rootMut[k].push((payload)=>fn(module.state, payload))
  })

  // store.actions.x
  let actions = module.actions || {}
  eachObj(actions, (k, fn) => {
    const rootAct = store.actions

    if(!rootAct[k]){
      rootAct[k] = []
    }

    rootAct[k].push((payload)=>fn(store, payload))
  })

  // 递归安装子模块
  if(module.modules){
    eachObj(module.modules, (modName, mod)=>{
      installModule(vm, store, state, path.concat(modName), mod)
    })
  }
}

