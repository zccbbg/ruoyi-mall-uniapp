import request from '@/sheep/request';
import $platform from '@/sheep/platform';

export default {
  getAppAccount: (type)=>
    request({
        url: '/no-auth/app/account/' + type,
        method: 'GET'
    }),
};
