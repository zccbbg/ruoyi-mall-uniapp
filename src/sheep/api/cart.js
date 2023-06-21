import request from '@/sheep/request';

export default {
  list: (data) =>
    request({
      url: '/h5/cart/list',
      method: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    }),
  append: (data) =>
    request({
      url: '/h5/cart/add',
      method: 'POST',
      custom: {
        showSuccess: true,
        successMsg: '已添加到购物车~',
      },
      data: {
        ...data,
        type: 'inc',
      },
    }),
  // 删除购物车
  delete: (ids) =>
    request({
      url: '/h5/cart/remove',
      method: 'DELETE',
      data: ids
    }),
  update: (data) =>
    request({
      url: '/h5/cart/modify',
      method: 'POST',
      data: data
    }),
};
