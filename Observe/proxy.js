export function proxy(vm, obj) {
  Object.keys(obj).forEach(k => {
    Object.defineProperty(vm, k, {
      configurable: true,
      enumerable: true,
      get(){
        return obj[k]
      },
      set(newVal){
        obj[k] = newVal
      }
    })
  })
}