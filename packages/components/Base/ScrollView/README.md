### 参数

| 参数名             | 参数类型                                                                                                                                                                                      |  默认值   |          说明          |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :--------------------: |
| direction?         | `'x' \| 'y' \| 'both'`                                                                                                                                                                        |    'y'    |        滚动方向        |
| scrollBehavior?    | `'auto' \| 'scroll' \| 'hidden'`                                                                                                                                                              |  'auto'   |       滚动条行为       |
| customScrollbar?   | `string`                                                                                                                                                                                      |           |     滚动条样式类名     |
| transformBoxClass? | `string`                                                                                                                                                                                      |           |      滚动区域样式      |
| border?            | `{`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`top?: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;`bottom?: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;`left?: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;`right?: number;`<br>`}` | undefined |      边界距离定义      |
| dataType?          | `string`                                                                                                                                                                                      |           |      事件代理类型      |
| slide?             | `boolean`                                                                                                                                                                                     |   false   |        滑动滚动        |
| slideOption?       | `{`<br>&nbsp;&nbsp;&nbsp;&nbsp;`threshold: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;`distance: (i: number) => number;`<br>`}`                                                                      | undefined | 滑动阈值和滑动距离映射 |


### 绑定事件 
| 事件名       | 事件定义                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @click       | `(e: Event) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| @touchBorder | `(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`type: { `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`direction: ('left' \| 'right' \| 'top' \| 'bottom')[];`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`mouseState: 'up' \| 'down' \| 'move'`<br>&nbsp;&nbsp;&nbsp;&nbsp;`};`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ref: any`<br>`) => void`                                                                                                                                                                                                    |
| @scroll      | `(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`e: Event,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`scrollState: {`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`mouseState: 'up' \| 'move' \| 'down';`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`scroll: {`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`x: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`y: number;`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`};`<br>&nbsp;&nbsp;&nbsp;&nbsp;`}`<br>`) => void;` |

### 插槽
| 插槽名  | 插槽作用                         |
| ------- | -------------------------------- |
| default | 滚动视区主体                     |
| extra   | 这部分位于滚动视区外，可视区域内 |


待解决
1. 滚动嵌套该如何反应
   1. 思路 判断是否触碰边界，如果碰到边界，把滚动事件传入父滚动组件

设计思路
1. 使用`transform`来对试图进行滚动
2. 在执行视图移动时进行如下流程
   1. 预处理（preScroll），计算即将到达的滚动位置，滚动结果需要被blanks等所限制
   2. 实际位移与理论位移进行比对(compare)，计算触碰边界等事件的结果。`边界事件`：某个方向的理论位移全部作用于空白部分位移或全部被边界所阻止，即任何位移不作用于正文内容。此时会触碰某个方向的边界事件，一次移动可以同时触发两个方向上的位移，同一个边界事件无法在一次点击移动中被连续触发。
   3. 对视图进行实际移动(move)
   4. 处理移动/滚动事件的抛出(event handle)
3. 滚动条位置采用实际位置计算比例的方式进行计算，不单独使用变量保存。

内部需要实现的api
1. scrollTo 滚动到指定位置
2. scrollBy 滚动一定位置
3. limitPosition 计算视图位移终点，将其限制在边界内，返回最终位置和边界触碰情况
4. scrollbarHeight计算滚动条的高度和位置(横向和纵向)
5. doslide 执行滑动的动画效果