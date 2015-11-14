
Cake 组件框架
====

Cake是一个轻量级的组件框架。目的是为复杂的业务ui逻辑编写提供统一的组件定义方式。

Cake组件是松散耦合的，简洁的api和扁平的层次结构使得Cake便于学习。


Cake不是MVC框架：

  Cake并没有提供完整代码逻辑分层，所以组件并没有明显的M、V、C的职责区分；
  Cake通过引入前端模板，仅实现了视图模板与代码逻辑的分离

Cake不是UI框架:

  严格的说，Cake是业务层UI组件框架。对于通用的、细粒度的UI，Cake并不适用。



特性
----

 - Cake本身基于AMD 模块化组织代码段

 - Cake提供了一种统一的组件定义方法，通过组件定义模板，可以更有效地提取通用逻辑；同时在团队开发时获得更好的维护性

 - Cake通过将组件绑定到dom的方式来实例化组件

 - Cake基于事件通信，组件间低耦合，组件间通过消息传递来通信

 - Cake实现了组件扩展机制，通过将通用功能封装为扩展，提高代码复用

 



后期可考虑增强项
----

  - 增加 组件 广播 频道

  - 模板扩展？增加嵌套模板支持

  - MVC扩展

  - 表单扩展

  - ajax 扩展？

  - debug (包含类似 tc的 可视化inspect，可以查看组件绑定情况，组件信息等。哇)

  - 组件增加 id 绑定到 dom data-cake-id 上 ，目的是 可通过 getInstanceById() 获取（但该方法又不能暴露出去，具体是啥用处呢？？？？ 思考ing）

  - 借鉴backbone， this.$  ? 



已处理bug
----

  - 代码中连续绑定两个相同组件到同一dom，两个组件都会绑定成功

    由于组件实例管理是在initialize的时候进行注册，如果第二个实例在第一个实例initialize前绑定，就可以出现这个问题。


  - praseEvent 的逻辑 执行时机？

    先前是在 initialize后，解析events建立dom监听
    但是，这样的问题是 不能在initialize中 利用监听（如不能直接用click方法触发回调）
    而后改成在initialize之前，带来了一个新的比较隐晦的bug：events不能自动销毁
    排除后发现根源是 在events注册的时候，组件还没有实例化，导致不能注册到 manager管理的 instance上。

    解决办法：将声明事件注册流程 转移到 扩展中实现

  - fixed AOP before bug 
  

更新功能项
----

  - 增加 this.element 标记 组件边界dom元素

  - 对attrs \ model 传入进行 clone 操作。

  - 组件定义时，单个扩展可以不加[]

  - 修改组件配置cfg 复制方式：匹配 'number','string','object' 三种类型即可，而不是只读取 .templates .attrs .events .name 等

  - events templates attrs model 都为可选项

  - templateExtension 模板加载方式 增加class选择器 （原先仅支持 id选择）

  - 事件委托 正则过滤修改，支持dom事件命名空间。

  - 事件委托扩展（EventExtension）改为 after initialize 后 执行，避免由于初始化阻塞造成事件先注册，但组件状态变量未初始化完成而引起脚本错误。

  - 对绑定组件实例的dom节点进行标示 (data-cake) ,便于遍历删除实例
 
  - 强制检测 name属性是否设置，未设置 抛出异常

  - 判断name是否有重复,重复抛出异常


mind
----


 - cake 不做过多的约束和配置及检测，建立在信任的基础上。例如attrs，约定只存放只读属性

 - cake 算作flight的变种。提供了flight一些没有的功能：

    独立的业务事件总线；
    组件销毁

 - requirejs ，cake 都是工具，建立模块化的系统，是我们的工作，不是工具。


 - 广播：避免了使用全局对象实现跨模块沟通的目的.类比集线器hub。

 - template : 避免xss攻击

