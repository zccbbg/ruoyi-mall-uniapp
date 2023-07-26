import request from '@/sheep/request';
import $platform from '@/sheep/platform';

export default {
  profile: () =>
    request({
      url: '/h5/member/info',
      method: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    }),
  update: (data) =>
    request({
      url: '/user/api/user/update',
      method: 'POST',
      custom: {
        showSuccess: true,
        auth: true,
      },
      data,
    }),
  // 账号登录
  accountLogin: (params) =>
    request({
      url: '/h5/account/login',
      method: 'post',
      data: params,
      custom: {
        showSuccess: true,
        loadingMsg: '登录中',
      },
    }),
  // 短信登录
  smsLogin: (params) =>
    request({
      url: '/h5/sms/login',
      method: 'post',
      data: params,
      custom: {
        showSuccess: true,
        loadingMsg: '登录中',
      },
    }),
  // 绑定openid
  getWechatUserAuth: (params) =>
    request({
      url: '/no-auth/wechat/getWechatUserAuth',
      method: 'POST',
      data: params
    }),
  // 设置会员微信信息
  setWechatInfo: (params) =>
    request({
      url: '/h5/member/setWechatInfo',
      method: 'POST',
      data: params
    }),
  // 短信注册
  smsRegister: (data) =>
    request({
      url: '/h5/register',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '正在注册',
      },
    }),
  // 注册校验手机号
  validatePhone: (data) =>
    request({
        url: `/h5/validate/` + data,
        method: 'get'
    }),
  // 重置密码
  resetPassword: (data) =>
    request({
      url: '/user/api/user/resetPassword',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '验证中',
      },
    }),
  recordLogin: () =>
    request({
        url: '/h5/record/login',
        method: 'GET'
    }),
  // 修改密码
  changePassword: (data) =>
    request({
      url: '/user/api/user/changePassword',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '验证中',
      },
    }),

  // 绑定、更换手机号
  changeMobile: (data) =>
    request({
      url: '/user/api/user/changeMobile',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '验证中',
      },
    }),

  // 修改用户名
  changeUsername: (data) =>
    request({
      url: '/user/api/user/changeUsername',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '验证中',
      },
    }),

  // 第三方授权信息
  thirdOauthInfo: () =>
    request({
      url: '/user/api/user/thirdOauth',
      method: 'GET',
      params: {
        provider: $platform.provider,
        platform: $platform.platform,
      },
      custom: {
        showLoading: false,
      },
    }),

  // 添加分享记录
  addShareLog: (data) =>
    request({
      url: 'share/add',
      method: 'POST',
      data,
      custom: {
        showError: false,
      },
    }),
  share: {
    list: (params) =>
      request({
        url: 'share/list',
        method: 'GET',
        params,
      }),
  },
  // 账号登出
  logout: (data) =>
    request({
      url: '/user/api/user/logout',
      method: 'POST',
      data,
    }),
  // 账号注销
  logoff: (data) =>
    request({
      url: '/user/api/user/logoff',
      method: 'POST',
      data,
    }),
    address: {
        default: () =>
            request({
                url: 'h5/member/address/default',
                method: 'GET',
                custom: {
                    showError: false,
                },
            }),
        list: () =>
            request({
                url: 'h5/member/address/list',
                method: 'GET',
                custom: {
                    showError: false,
                },
            }),
        create: (data) =>
            request({
                url: 'h5/member/address/create',
                method: 'POST',
                data,
                custom: {
                    showSuccess: true,
                },
            }),
        update: (data) =>
            request({
                url: 'h5/member/address/update',
                method: 'PUT',
                data,
                custom: {
                    showSuccess: true,
                },
            }),
        detail: (id) =>
            request({
                url: 'h5/member/address/' + id,
                method: 'GET',
            }),
        delete: (id) =>
            request({
                url: 'h5/member/address/' + id,
                method: 'DELETE',
            }),
    },

  invoice: {
    list: () =>
      request({
        url: 'user/invoice',
        method: 'GET',
        custom: {},
      }),
    create: (data) =>
      request({
        url: 'user/invoice',
        method: 'POST',
        data,
        custom: {
          showSuccess: true,
        },
      }),
    update: (id, data) =>
      request({
        url: 'user/invoice/' + id,
        method: 'PUT',
        data,
        custom: {
          showSuccess: true,
        },
      }),
    detail: (id) =>
      request({
        url: 'user/invoice/' + id,
        method: 'GET',
      }),
    delete: (id) =>
      request({
        url: 'user/invoice/' + id,
        method: 'DELETE',
      }),
  },
  favorite: {
    list: (params) =>
      request({
        url: 'user/goodsLog/favorite',
        method: 'GET',
        params,
      }),
    do: (id) =>
      request({
        url: 'user/goodsLog/favorite',
        method: 'POST',
        data: {
          goods_id: id,
        },
        custom: {
          showSuccess: true,
          auth: true,
        },
      }),
    cancel: (id) =>
      request({
        url: 'user/goodsLog/favorite',
        method: 'POST',
        data: {
          goods_ids: id,
        },
        custom: {
          showSuccess: true,
          auth: true,
        },
      }),
  },
  view: {
    list: (params) =>
      request({
        url: 'user/goodsLog/views',
        method: 'GET',
        params,
        custom: {},
      }),
    delete: (data) =>
      request({
        url: 'user/goodsLog/viewDel',
        method: 'DELETE',
        data,
        custom: {
          showSuccess: true,
        },
      }),
  },
  wallet: {
    log: (params) =>
      request({
        url: '/user/api/walletLog',
        method: 'GET',
        params,
        custom: {},
      }),
  },
  account: {
    info: (params) =>
      request({
        url: 'user/account',
        method: 'GET',
        params,
        custom: {
          showError: false,
          auth: true,
        },
      }),
    save: (data) =>
      request({
        url: 'user/account',
        method: 'POST',
        data,
        custom: {
          showSuccess: true,
          auth: true,
        },
      }),
  },
  //数量接口
  // data: () =>
  //   request({
  //     url: 'user/user/data',
  //     method: 'GET',
  //     custom: {
  //       showLoading: false,
  //       auth: true,
  //     },
  //   }),
};
