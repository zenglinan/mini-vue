# Mini Vue
> ## Vue
#### 实现功能
- 实现响应式数据（支持对象、数组）
- 插值表达式
- vue 指令
  - v-text
  - v-model

#### 实现思路
1. Vue 对 data 进行 observer 操作，将对象中的每个键，进行 ```Object.defineProperty``` 重写，实现响应式数据。
2. 在 ```Object.defineProperty``` 中对每个 key 都添加了一个 ```Dep```（依赖管理器），用来管理 ```Watcher```（观察者）
3. 在编译的时候，当发现 DOM节点中有一处使用了某个 Vue 实例数据时，就实例化一个 ```Watcher```，
将依赖管理器的目标指向当前 Watcher，然后读取一下这个 key，触发 get，将该 Watcher 收集进该 key 的 dep 实例，实现依赖收集
4. 在 data 值发生变更时，触发 set，set 中触发依赖管理器中的更新方法，通知所有 Watcher 触发更新。


> ## Vuex
#### 实现功能
- state
- getters
- mutations
- actions
- modules
