<!--
 * @Author: Qisumi 940858763@qq.com
 * @Date: 2023-08-16 20:01:17
 * @LastEditors: Qisumi 940858763@qq.com
 * @LastEditTime: 2023-08-16 21:19:43
 * @FilePath: \DYJJHelper\README.md
 * @Description: 
 * 
-->
# DYJJHelper-web

用来帮助导员姐姐完成繁琐工作的一系列工具，这是它的Web版本，主要用于完成一些网页端工作的自动化。

目前完成的功能如下

## 1. 自动化审批入校申请及信息显示增强

### 脚本适用范围
1. ywgl.seu.edu.cn 即辅导员管理页面
2. infoplus.seu.edu.cn 即具体审批页面

## 注意点
这个功能有两个需要注意的点，首先自动审批筛选条件在`filter`这个函数内更改。特别的，JS中的月份表示是`0~11`。其次，自动审批的起始页面必须是符合筛选条件的，这里没有做防呆处理。


## TODO
1. 完成入校申请审批的防呆设计。
2. 修改程序结构，增加浮窗UI，使其可以方便的增加功能。