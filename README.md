## B站讲解视频
https://www.bilibili.com/video/BV16N4y1d7MM

## node 推荐版本
16.13.1

## 技术栈

- **前端技术栈：uni-app、ES6、Vue3、Vite、Pinia;**

```bash
# 安装依赖 (需安装nodejs环境, 使用npm国内镜像)
$ npm install --registry=https://registry.npmmirror.com
```
## 启动方式
更推荐用vscode或者webstorm开发，所以请不要使用hbuilder启动。
```bash
# h5页面
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
```

## 项目地址
|            | gitee                                      | github                                       |
|:----------:|:-------------------------------------------|:---------------------------------------------|
|  service   | https://gitee.com/zccbbg/RuoYi-Mall        | https://github.com/zccbbg/ruoyi-mall    |
| 管理后台前端vue2 | https://gitee.com/zccbbg/ruoyi-mall-vue| https://github.com/zccbbg/ruoyi-mall-vue |
| h5 uniapp  | https://gitee.com/zccbbg/ruoyi-mall-uniapp | https://github.com/zccbbg/ruoyi-mall-uniapp  |
## 项目结构

```
├── pages                   // 页面
│      ├── index            // 入口页面
│      ├── user             // 用户相关
│      ├── public           // 公共页面
│      ├── activity         // 活动页面
│      ├── app              // 积分、签到页面
│      ├── chat             // 客服页面
│      ├── commission       // 分销页面
│      ├── coupon           // 优惠券页面
│      ├── goods            // 商品页面
│      ├── order            // 订单页面
│      ├── pay              // 支付页面
├── sheep                   // 底层依赖/工具库
│      ├── api              // 服务端接口
│      ├── components       // 自定义功能组件
│      ├── config           // 配置文件
│      ├── helper           // 助手函数
│      ├── hooks            // vue-hooks
│      ├── libs             // 自定义依赖
│      ├── platform         // 第三方平台登录、分享、支付
│      ├── request          // 请求类库
│      ├── router           // 自定义路由跳转
│      ├── scss             // 主样式库
│      ├── store            // pinia状态管理模块
│      ├── ui               // 自定义UI组件
│      ├── url              // cdn图片地址格式化
│      ├── validate         // 通用验证器
│      ├── index.js         // Shopro入口文件
├── uni_modules             // dcloud第三方插件

```
