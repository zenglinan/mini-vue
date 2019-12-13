let Vue

class Store{
  constructor(options){
    this._state = new Vue({ // 将 state 存入 Vue 实例的 data 中，以实现响应式数据
      data: { state: options.state }
    })
    this.generateGetters(options.getters)
    this.generateMutations(options.mutations)
    this.generateActions(options.actions)
  }

  generateGetters(getters = {}){
    this._getters = {}
    Object.keys(getters).forEach(k => {
      Object.defineProperty(this._getters, k, {
        get: ()=>{  // 箭头函数保证 this 能够访问到当前 store 实例
          return getters[k](this.state)
        }
      })
    })
  }
  generateMutations(mutations = {}){
    this._mutations = {}
    Object.keys(mutations).forEach(k => {
      this._mutations[k] = (payload) => {
        mutations[k](this.state, payload)
      }
    })
  }
  generateActions(actions = {}){
    this._actions = {}
    Object.keys(actions).forEach(k => {
      this._actions[k] = (payload) => {
        actions[k](this, payload)
      }
    })
  }

  commit = (type, payload) => { // 箭头函数，保证 this 指向当前 store 实例
    // 执行 mutations
    return this._mutations[type](payload)
  }
  dispatch = (type, payload) => {
    return new Promise((resolve, reject) => {
      try{
        resolve(this._actions[type](payload))
      } catch (e){
        reject(e)
      }
    })
  }

  get state(){
    return this._state.state // 不直接暴露出 $store.state，通过访问器的形式暴露访问，保证 state 无法被直接修改
  }
  get getters(){
    return this._getters
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
