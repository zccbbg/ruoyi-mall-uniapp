import request from '@/sheep/request';

export default {
  list: (params) =>
    request({
      url: '/no-auth/category/all-categories',
      method: 'GET',
      params,
    }),
};
