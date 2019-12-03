import {compile} from './compile'
import {observe} from './observe'
import {proxy} from "./proxy"
import {getData} from "./utils/get_data"

function Vue (options){
  this.$options = options
  this.$el = options.el
  this.$data = getData(this, options.data)

  // 实现数据劫持
  observe(this.$data)

  // 实现代理：this.$data.a -> this.a
  proxy(this, this.$data)

  // 编译模板进行依赖收集
  compile(this.$el)
}