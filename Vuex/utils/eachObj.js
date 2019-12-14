export function eachObj(obj, callback){
  Object.keys(obj).forEach(k => {
    callback(k, obj[k])
  })
}