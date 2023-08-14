import appApi from '@/sheep/api/app';
import { defineStore } from 'pinia';
import $platform from '@/sheep/platform';
import $router from '@/sheep/router';
import user from './user';
import sys from './sys';

const app = defineStore({
  id: 'app',
  state: () => ({
    info: {
      // 应用信息
      name: '', // 商城名称
      logo: '', // logo
      version: '', // 版本号
      cdnurl: '', // 云存储域名
      filesystem: '', // 云存储平台
      user_protocol: {}, // 用户协议
      privacy_protocol: {}, // 隐私协议
      about_us: {}, // 关于我们
      copyright: '', // 版权信息 I
      copytime: '', // 版权信息 II
    },
    platform: {
      payment: [], // 支持的支付方式
      recharge_payment: [], // 支持的充值支付方式
      share: {
        methods: [], // 支持的分享方式
        forwardInfo: {}, // 默认转发信息
        posterInfo: {}, // 海报信息
        linkAddress: '', // 复制链接地址
      },
      auto_login: 0, // 自动登陆
      bind_mobile: 0, // 登陆后绑定手机号提醒 (弱提醒，可手动关闭)
    },
    chat: {},
    template: {
      // 店铺装修模板
      basic: {}, // 基本信息
      home: {
        // 首页模板
        style: {},
        data: [],
      },
      user: {
        // 个人中心模板
        style: {},
        data: [],
      },
    },
    shareInfo: {}, // 全局分享信息
    authInfo: null
  }),
  actions: {
    // 获取Shopro应用配置和模板
    async init(templateId = null) {
      //检查网络
      // const networkStatus = await $platform.checkNetwork();
      // if (!networkStatus) {
      //   $router.error('NetworkError');
      // }
      const res = {
    "error": 0,
    "msg": "初始化",
    "data": {
        "app": {
            "name": "Shopro",
            "logo": "\/static\/img\/shop\/logo.png",
            "cdnurl": "https:\/\/file.sheepjs.com",
            "filesystem": "qcloud",
            "version": "1.1.13",
            "user_protocol": {
                "title": "用户协议",
                "id": "1"
            },
            "privacy_protocol": {
                "title": "隐私协议",
                "id": "2"
            },
            "about_us": {
                "title": "关于我们",
                "id": "3"
            },
            "copyright": "河南星品科技有限公司版权所有",
            "copytime": "Copyright© 2018-2022"
        },
        "platform": {
            "auto_login": 0,
            "bind_mobile": 0,
            "payment": [
                "money",
                "alipay",
                "wechat",
                "offline"
            ],
            "recharge_payment": [
                "wechat",
                "alipay"
            ],
            "share": {
                "methods": [
                    "poster",
                    "link"
                ],
                "linkAddress": "https:\/\/mall.ichengle.top\/uni\/#\/",
                "posterInfo": {
                    "user_bg": "\/static\/img\/shop\/config\/user-poster-bg.png",
                    "goods_bg": "\/static\/img\/shop\/config\/goods-poster-bg.png",
                    "groupon_bg": "\/static\/img\/shop\/config\/groupon-poster-bg.png"
                }
            }
        },
        "template": {
            "basic": {
                "tabbar": {
                    "mode": 1,
                    "layout": 1,
                    "inactiveColor": "#8C8C8C",
                    "activeColor": "#FF7A0C",
                    "list": [
                        {
                            "inactiveIcon": "\/storage\/decorate\/20221115\/76574bb482da1fd62539c0253f0152d6.png",
                            "activeIcon": "\/storage\/decorate\/20221115\/c92d07a10eec8850ab9a481638e5159b.gif",
                            "url": "\/pages\/index\/index",
                            "text": "首页"
                        },
                        {
                            "inactiveIcon": "\/storage\/decorate\/20221115\/113eb988efc1fe17cb90cdf5311e5b63.png",
                            "activeIcon": "\/storage\/decorate\/20221115\/2a3992a220f306d129ac1659304694bd.gif",
                            "url": "\/pages\/index\/cart",
                            "text": "购物车"
                        },
                        {
                            "inactiveIcon": "\/storage\/decorate\/20221115\/f930c59d338a97a158ee53cb65bde082.png",
                            "activeIcon": "\/storage\/decorate\/20221115\/1130ab158b1c31b1e1d356fa78bb5f4a.gif",
                            "url": "\/pages\/index\/user",
                            "text": "我的"
                        }
                    ],
                    "background": {
                        "type": "color",
                        "bgImage": "",
                        "bgColor": "#FFFFFF"
                    }
                },
                "floatMenu": {
                    "show": 0,
                    "mode": 1,
                    "isText": 0,
                    "list": [
                        {
                            "src": "",
                            "url": "",
                            "title": {
                                "text": "",
                                "color": ""
                            }
                        }
                    ]
                },
                "popupImage": {
                    "list": [
                        {
                            "src": "\/storage\/decorate\/20221115\/6bfd03d0ad7f3d7f6ba7494c903cdc0c.png",
                            "url": "\/pages\/index\/category?id=21",
                            "show": 2
                        }
                    ]
                },
                "theme": "orange"
            },
            "home": {
                "data": [
                    {
                        "type": "imageBanner",
                        "data": {
                            "mode": 1,
                            "indicator": 1,
                            "list": [
                                {
                                    "title": "banner01",
                                    "type": "image",
                                    "src": "\/storage\/default\/20230110\/fb5f5d3ade8990c789217b35fba27ef8.png",
                                    "poster": "",
                                    "url": "\/pages\/index\/category?id=21"
                                }
                            ],
                            "space": 0
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": "#FFFFFF"
                            },
                            "marginLeft": 0,
                            "marginRight": 0,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0
                        }
                    },
                    {
                        "type": "menuButton",
                        "data": {
                            "layout": 1,
                            "col": 5,
                            "row": 1,
                            "list": [
                                {
                                    "src": "\/storage\/decorate\/20221115\/7e7da5a9fe78d731c217f14922b627bc.png",
                                    "title": {
                                        "text": "签到有礼",
                                        "color": "#FFFFFF"
                                    },
                                    "url": "\/pages\/app\/sign",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/4a9bde33fd13459833431db72282e91c.png",
                                    "title": {
                                        "text": "居家生活",
                                        "color": "#FFFFFF"
                                    },
                                    "url": "\/pages\/index\/category?id=21",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/e65f9b968d33f335cdff6b5e0befef8e.png",
                                    "title": {
                                        "text": "数码家电",
                                        "color": "#FFFFFF"
                                    },
                                    "url": "\/pages\/index\/category?id=21",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/9918d064eefa8fb1fda5715db2c248ab.png",
                                    "title": {
                                        "text": "服饰鞋包",
                                        "color": "#FFFFFF"
                                    },
                                    "url": "\/pages\/index\/category?id=21",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/f6c52397b662f42a29c4e0e6244b1b16.png",
                                    "title": {
                                        "text": "个护清洁",
                                        "color": "#FFFFFF"
                                    },
                                    "url": "\/pages\/index\/category?id=21",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                }
                            ]
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 0,
                            "marginRight": 0,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0
                        }
                    },
                    {
                        "type": "imageCube",
                        "data": {
                            "borderRadiusTop": 8,
                            "borderRadiusBottom": 8,
                            "space": 7,
                            "list": [
                                {
                                    "width": 2,
                                    "height": 2,
                                    "top": 0,
                                    "left": 0,
                                    "src": "\/storage\/decorate\/20221115\/63cbe4b8088a28a129923b65f412fcb2.png",
                                    "url": "\/pages\/index\/category?id=21"
                                },
                                {
                                    "width": 2,
                                    "height": 1,
                                    "top": 0,
                                    "left": 2,
                                    "src": "\/storage\/decorate\/20221115\/50e077b0a5df1c48dcd9be4e47b03324.png",
                                    "url": "\/pages\/index\/category?id=21"
                                },
                                {
                                    "width": 2,
                                    "height": 1,
                                    "top": 1,
                                    "left": 2,
                                    "src": "\/storage\/decorate\/20221115\/a44ee2a893e6b296efcd167fe0dc246d.png",
                                    "url": "\/pages\/index\/category?id=21"
                                }
                            ]
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 8,
                            "marginRight": 8,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0
                        }
                    },
                    {
                        "type": "titleBlock",
                        "data": {
                            "src": "\/storage\/decorate\/20221115\/70845d2cb5fc68882b27ad3de9a100e0.png",
                            "location": "left",
                            "skew": 34,
                            "title": {
                                "text": "",
                                "color": "#262626",
                                "textFontSize": 16,
                                "other": []
                            },
                            "subtitle": {
                                "text": "",
                                "color": "#8c8c8c",
                                "textFontSize": 0,
                                "other": []
                            },
                            "more": {
                                "show": 0,
                                "url": "\/pages\/index\/category?id=21"
                            }
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 8,
                            "marginRight": 8,
                            "marginTop": 0,
                            "marginBottom": 0,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0,
                            "height": 40
                        }
                    },
                    {
                        "type": "goodsCard",
                        "data": {
                            "mode": 3,
                            "goodsFields": {
                                "title": {
                                    "show": 1,
                                    "color": "#262626"
                                },
                                "subtitle": {
                                    "show": 1,
                                    "color": "#8C8C8C"
                                },
                                "price": {
                                    "show": 1,
                                    "color": "#FF3000"
                                },
                                "original_price": {
                                    "show": 1,
                                    "color": "#C4C4C4"
                                },
                                "sales": {
                                    "show": 1,
                                    "color": "#C4C4C4"
                                },
                                "stock": {
                                    "show": 0,
                                    "color": "#C4C4C4"
                                }
                            },
                            "buyNowStyle": {
                                "mode": 1,
                                "text": "立即购买",
                                "color1": "#FE832A",
                                "color2": "#FF6000",
                                "src": ""
                            },
                            "tagStyle": {
                                "show": 0,
                                "src": ""
                            },
                            "goodsIds": [
                                17,
                                18,
                                19
                            ],
                            "borderRadiusTop": 6,
                            "borderRadiusBottom": 6,
                            "space": 8
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 8,
                            "marginRight": 8,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0
                        }
                    },
                    {
                        "type": "titleBlock",
                        "data": {
                            "src": "\/storage\/decorate\/20221115\/ce9cb18e6cd8dda71287195d97fc5c2d.png",
                            "location": "left",
                            "skew": null,
                            "title": {
                                "text": "",
                                "color": "#262626",
                                "textFontSize": 16,
                                "other": []
                            },
                            "subtitle": {
                                "text": "",
                                "color": "#8c8c8c",
                                "textFontSize": 0,
                                "other": []
                            },
                            "more": {
                                "show": 0,
                                "url": "\/pages\/index\/category?id=21"
                            }
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 8,
                            "marginRight": 8,
                            "marginTop": 0,
                            "marginBottom": 0,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0,
                            "height": 40
                        }
                    },
                    {
                        "type": "goodsCard",
                        "data": {
                            "mode": 2,
                            "goodsFields": {
                                "title": {
                                    "show": 1,
                                    "color": "#262626"
                                },
                                "subtitle": {
                                    "show": 1,
                                    "color": "#8C8C8C"
                                },
                                "price": {
                                    "show": 1,
                                    "color": "#FF3000"
                                },
                                "original_price": {
                                    "show": 1,
                                    "color": "#C4C4C4"
                                },
                                "sales": {
                                    "show": 1,
                                    "color": "#C4C4C4"
                                },
                                "stock": {
                                    "show": 0,
                                    "color": "#C4C4C4"
                                }
                            },
                            "buyNowStyle": {
                                "mode": 2,
                                "text": "立即购买",
                                "color1": "#E9B461",
                                "color2": "#EECC89",
                                "src": "\/storage\/decorate\/20221115\/4782356b4587dc4f4a218f2540a0bafc.png"
                            },
                            "tagStyle": {
                                "show": 0,
                                "src": ""
                            },
                            "goodsIds": [
                                14,
                                16,
                                12,
                                8,
                                9,
                                21
                            ],
                            "borderRadiusTop": 6,
                            "borderRadiusBottom": 6,
                            "space": 8
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            },
                            "marginLeft": 8,
                            "marginRight": 8,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "padding": 0
                        }
                    }
                ],
                "style": {
                    "background": {
                        "color": "#FF9237",
                        "src": ""
                    },
                    "navbar": {
                        "mode": "inner",
                        "alwaysShow": 1,
                        "type": "color",
                        "color": "#EB3924",
                        "src": "",
                        "list": {
                            "mp": [
                                {
                                    "width": 5,
                                    "height": 1,
                                    "top": 0,
                                    "left": 0,
                                    "type": "search",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "",
                                    "url": "",
                                    "placeholder": "请输入关键字",
                                    "borderRadius": 20
                                },
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 5,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/6e30b6357d3285d7d007ac308e7b2b12.png",
                                    "url": "\/pages\/coupon\/list",
                                    "placeholder": "",
                                    "borderRadius": 0
                                }
                            ],
                            "app": [
                                {
                                    "width": 7,
                                    "height": 1,
                                    "top": 0,
                                    "left": 0,
                                    "type": "search",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "",
                                    "url": "",
                                    "placeholder": "请输入关键字",
                                    "borderRadius": 23
                                },
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 7,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/6e30b6357d3285d7d007ac308e7b2b12.png",
                                    "url": "\/pages\/coupon\/list",
                                    "placeholder": "",
                                    "borderRadius": 0
                                }
                            ]
                        }
                    }
                }
            },
            "user": {
                "data": [
                    {
                        "type": "userCard",
                        "style": {
                            "marginLeft": 0,
                            "marginRight": 0,
                            "marginTop": 70,
                            "marginBottom": 10,
                            "borderRadiusTop": 0,
                            "borderRadiusBottom": 0,
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": ""
                            }
                        }
                    },
                    {
                        "type": "orderCard",
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": "#FFFFFF"
                            },
                            "marginLeft": 10,
                            "marginRight": 10,
                            "marginTop": 0,
                            "marginBottom": 8,
                            "borderRadiusTop": 8,
                            "borderRadiusBottom": 8,
                            "padding": 0
                        }
                    },
                    {
                        "type": "couponCard",
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": "#FFFFFF"
                            },
                            "marginLeft": 10,
                            "marginRight": 10,
                            "marginTop": 0,
                            "marginBottom": 8,
                            "borderRadiusTop": 8,
                            "borderRadiusBottom": 8,
                            "padding": 0
                        }
                    },
                    // {
                    //     "type": "walletCard",
                    //     "style": {
                    //         "background": {
                    //             "type": "color",
                    //             "bgImage": "",
                    //             "bgColor": "#FFFFFF"
                    //         },
                    //         "marginLeft": 10,
                    //         "marginRight": 10,
                    //         "marginTop": 0,
                    //         "marginBottom": 8,
                    //         "borderRadiusTop": 8,
                    //         "borderRadiusBottom": 8,
                    //         "padding": 0
                    //     }
                    // },
                    {
                        "type": "menuGrid",
                        "data": {
                            "col": 4,
                            "list": [
                                {
                                    "src": "\/storage\/decorate\/20221115\/9ff8442f8cda57f88aac61059d7d3f21.png",
                                    "title": {
                                        "text": "签到",
                                        "color": "#333333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/app\/sign",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/9464fe770d388c7982df73b2d1b1d457.png",
                                    "title": {
                                        "text": "设置",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/public\/setting",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/ac3bdfced7c4c5f17f03b48f6d3fa3ec.png",
                                    "title": {
                                        "text": "收藏",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/user\/goods-collect",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/94eb324f16b6b48e65c4ea1cf7d3c1fd.png",
                                    "title": {
                                        "text": "浏览足迹",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/user\/goods-log",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/215f0aa658e271b3018f2d421bea694f.png",
                                    "title": {
                                        "text": "意见反馈",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/public\/feedback",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/0c37315a83f9424a4717ef684984c9c0.png",
                                    "title": {
                                        "text": "常见问题",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/public\/faq",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/58fe6c2a400d6d18a43949f3d8c58021.png",
                                    "title": {
                                        "text": "积分商城",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/app\/score-shop",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/6d0a8c85ba41464b5493226c91c72459.png",
                                    "title": {
                                        "text": "关于我们",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/public\/richtext?id=3",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/92bf692d57b8fc2e76815ce6627ef1f9.png",
                                    "title": {
                                        "text": "隐私协议",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/public\/richtext?id=2",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/26dff8fb21473e219c6f024fc6a5e39a.png",
                                    "title": {
                                        "text": "我的团队",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/user\/address\/list",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/26dff8fb21473e219c6f024fc6a5e39a.png",
                                    "title": {
                                        "text": "收货地址",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/user\/address\/list",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                },
                                {
                                    "src": "\/storage\/decorate\/20221115\/3c7eb06563d1cf28b4b34bb0d1647659.png",
                                    "title": {
                                        "text": "联系客服",
                                        "color": "#333"
                                    },
                                    "tip": {
                                        "text": "",
                                        "color": "#bbb"
                                    },
                                    "url": "\/pages\/chat\/index",
                                    "badge": {
                                        "show": 0,
                                        "text": "",
                                        "color": "#FFFFFF",
                                        "bgColor": "#FF6000"
                                    }
                                }
                            ]
                        },
                        "style": {
                            "background": {
                                "type": "color",
                                "bgImage": "",
                                "bgColor": "#FFFFFF"
                            },
                            "marginLeft": 10,
                            "marginRight": 10,
                            "marginTop": 0,
                            "marginBottom": 10,
                            "borderRadiusTop": 8,
                            "borderRadiusBottom": 8,
                            "padding": 0
                        }
                    }
                ],
                "style": {
                    "background": {
                        "color": "#F6F6F6",
                        "src": "\/storage\/decorate\/20221115\/b530150a466c8cda0a4cd5b29e2c8d11.png"
                    },
                    "navbar": {
                        "mode": "inner",
                        "alwaysShow": 1,
                        "type": "image",
                        "color": "",
                        "src": "\/storage\/decorate\/20221115\/283592b4d4f74d84b530035fa7265d73.png",
                        "list": {
                            "mp": [
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 0,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/c47b048175b325b1e78f837a3b696794.png",
                                    "url": "\/pages\/chat\/index",
                                    "placeholder": "",
                                    "borderRadius": 0
                                },
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 1,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/f09ef51624e48d7d8c58cd602110c46e.png",
                                    "url": "\/pages\/commission\/goods",
                                    "placeholder": "",
                                    "borderRadius": 0
                                }
                            ],
                            "app": [
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 0,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/c47b048175b325b1e78f837a3b696794.png",
                                    "url": "\/pages\/chat\/index",
                                    "placeholder": "",
                                    "borderRadius": 0
                                },
                                {
                                    "width": 1,
                                    "height": 1,
                                    "top": 0,
                                    "left": 1,
                                    "type": "image",
                                    "text": "",
                                    "textColor": "#111111",
                                    "src": "\/storage\/decorate\/20221115\/f09ef51624e48d7d8c58cd602110c46e.png",
                                    "url": "\/pages\/commission\/goods",
                                    "placeholder": "",
                                    "borderRadius": 0
                                }
                            ]
                        }
                    }
                }
            }
        },
        "chat": {
            "room_id": "admin",
            "chat_domain": "https:\/\/api.shopro.sheepjs.com\/chat"
        }
    }
}
      if (res.error === 0) {
        this.info = res.data.app;
        this.platform = res.data.platform;
        this.template = res.data.template;
        if (!res.data.template) {
          $router.error('TemplateError');
        }
        this.chat = res.data.chat;

        // 加载主题
        const sysStore = sys();
        sysStore.setTheme();

        // 模拟用户登录
        const userStore = user();
        if (userStore.isLogin) {
          userStore.loginAfter();
        }
        return Promise.resolve(true);
      } else {
        $router.error('InitError', res.msg || '加载失败');
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'app-store',
      },
    ],
  },
});

export default app;
