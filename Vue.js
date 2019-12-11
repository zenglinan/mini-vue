import Compile from './compile.js'
import {observe} from './observe.js'
import {proxy} from "./proxy.js"
import {getData} from "./utils/get_data.js"

export default function Vue (options){
  this.$options = options
  this.$el = options.el
  this.$data = getData(this, options.data)

  // 实现数据劫持
  observe(this.$data)

  // 实现代理：this.$data.a -> this.a
  proxy(this, this.$data)

  // 编译模板进行依赖收集
  new Compile(this, this.$el)
}