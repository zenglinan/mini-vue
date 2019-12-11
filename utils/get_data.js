import {isPlainObject} from "./type_assert.js";

export function getData(vm, data){
  if(isPlainObject(data)){
    return data
  } else {
    return data.bind(vm)()  // 绑定内部的 this 为 vue 实例
  }
}