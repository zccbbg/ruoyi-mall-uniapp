import request from '@/sheep/request';

export default {
  myGroupon: (params) =>
    request({
      url: 'activity/groupon/myGroupons',
      method: 'GET',
      params,
    }),
  getGrouponList: (params) =>
    request({
      url: 'activity/groupon',
      method: 'GET',
      params,
    }),
  grouponDetail: (id) =>
    request({
      url: 'activity/groupon/' + id,
      method: 'GET',
    }),
  signList: (params) =>
    request({
      url: 'h5/act/integral/list',
      method: 'GET',
      params,
    }),
  signAdd: (params) =>
    request({
      url: 'h5/act/integral/add',
      method: 'POST',
      params
    }),
  replenish: (data) =>
    request({
      url: 'activity/signin/replenish',
      method: 'POST',
      data,
    }),
  activity: (id) =>
    request({
      url: 'activity/activity/' + id,
      method: 'GET',
    }),
};
