import request from '@/sheep/request';

export default {
  area: () =>
    request({
      url: '/h5/area',
      method: 'GET',
    }),
  faq: () =>
    request({
      url: 'data/faq',
      method: 'GET',
    }),
  richtext: (id) =>
    request({
      url: 'data/richtext/' + id,
      method: 'GET',
    }),
  getSysConfig: (params) =>
    request({
        url: '/no-auth/config/get',
        method: 'GET',
        params,
        custom: {
            showSuccess: false,
            auth: false,
        },
    }),
};
