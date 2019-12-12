export default class Dep {
  constructor(){
    this.watchers = []
  }
  
  add(watcher){
    this.watchers.push(watcher)
  }

  notify(){
    this.watchers.map(w => {
      w.update()
    })
  }
} 