function deepClone(obj, cache = []){
  if(typeof obj !== 'object') return
  if(cache.includes(obj)) return
  cache.push(obj)
  let result = Array.isArray(obj) ? [] : {}

  Reflect.ownKeys(obj).map(k => {
    const val = obj[k]
    result[k] = typeof val === 'object' ? deepClone(val, cache) : val
  })

  return result
}

console.log(deepClone({
  a: 1,
  b: {
    c: 2
  },
  d: function () {
  },
  [Symbol('xxx')]: 2
}));