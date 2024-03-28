import request from '@/sheep/request';

export default {
    list: (params) =>
        request({
            url: 'h5/coupon/activity/list',
            method: 'POST',
            params,
            custom: {
                showLoading: true,
            },
        }),
    activityDetail: (id) =>
        request({
            url: 'h5/coupon/activity/get?id=' + id,
            method: 'GET',
        }),
    userCoupon: (data,params) =>
        request({
            url: 'h5/coupon/list',
            method: 'POST',
            params,
            data,
            custom: {
                showLoading: true,
            },
        }),
    get: (id) =>
        request({
            url: 'h5/coupon/receive?id=' + id,
            method: 'POST',
        }),
    listByGoods: (id) =>
        request({
            url: 'coupon/listByGoods/' + id,
            method: 'GET',
        }),
};
