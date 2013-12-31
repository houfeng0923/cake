

**todo**

增加 组件 广播 频道


对绑定组件实例的dom节点进行标示 (data-cake) ,便于遍历删除实例

模板扩展？增加嵌套模板支持

MVC扩展


表单扩展

ajax 扩展？

debug (包含类似 tc的 可视化inspect，可以查看组件绑定情况，组件信息等。哇)

组件增加 id 绑定到 dom data-cake-id 上 ，目的是 可通过 getInstanceById() 获取（但该方法又不能暴露出去，具体是啥用处呢？？？？ 思考ing）


**bug**

  代码中连续绑定两个相同组件到同一dom，两个组件都会绑定成功
  由于组件实例管理是在initialize的时候进行注册，如果第二个实例在第一个实例initialize前绑定，就可以出现这个问题。


  praseEvent 的逻辑 执行时机？
    先前是在 initialize后，解析events建立dom监听
    但是，这样的问题是 不能在initialize中 利用监听（如不能直接用click方法触发回调）
    而后改成在initialize之前，带来了一个新的比较隐晦的bug：events不能自动销毁
    排除后发现根源是 在events注册的时候，组件还没有实例化，导致不能注册到 manager管理的 instance上。

    解决办法：将声明事件注册流程 转移到 扩展中实现

  

**add**

this.element

attrs \ model 传入进行 clone 操作。

组件定义时，单个扩展可以不加[]

修改组件配置cfg 复制方式：匹配 'number','string','object' 三种类型即可，而不是只读取 .templates .attrs .events .name 等


events templates attrs model 都为可选项

templateExtension 模板加载方式 增加class选择器 （原先仅支持 id选择）