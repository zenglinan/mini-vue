import Dep from './Dep.js'

export class Watcher {
  constructor(vm, key, cb){
    this.cb = cb
    
    Dep.target = this
    vm[key] // 读一下这个属性
    Dep.target = null // 置空 Dep 指向的 wacther
  }

  update(){
    this.cb()
  }
}