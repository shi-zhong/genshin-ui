### 更新日志

- `2024-01-03` `v1.0.0`
  
  初始版本，包含内容如下：
  
  1. 基础组件`Icon `, `Popover`,`ScrollView`
  2. UI组件`Button`, `Card`, `HightLight`, `Loading`, `Menu`, `Message`, `Modal`,`Select`,`Tabs`,`Tags`
  3. 图片资源`Element`,`Weapon`
  4. 工具函数`useMockScrollDrag`
  5. 各文件依赖及打包文件

- `2024-01-05` `v1.0.1`
  1. 修改了`Message`组件容器的初始化位置，避免了node环境下访问`document`变量
  2. 修改了`Modal`组件`Teleport`的容器写法，避免在`script`中直接访问`docuent`

- `2024-01-14` `v1.0.2`
  1. 重构了`Button`组件样式，优化代码组织。添加按钮激活时的图标变色。
  2. 更改了`Loading`组件的类型声明。
  3. 为`Menu`组件添加了`modelValue`的初始化同步声明
  4. 新导出工具函数`EventDispatch`，`ClassName`组，从工具函数库中同步`EventDispatch`。
  5. 添加了`Weapon`，`Element`，`Artifact`的反向枚举。修改了这三个的导出方式。
  6. 额外导出了`version`变量。

- ${__INFO__}
  1. 解决了`Menu`值不随外部`v-model`更新的问题
  2. 对`Button`组件；添加了`$add`,`$reduce`图标。
  3. 添加了`SingleLoading`,`InputNumber`， `Slider`, `Switch`组件
  4. 添加了`vLongPress`指令