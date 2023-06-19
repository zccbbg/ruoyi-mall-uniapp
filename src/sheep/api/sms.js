import request from '@/sheep/request';

export default {
    sendAliyun: (phones) =>
        request({
            url: '/sms/sendAliyun',
            method: 'GET',
            params: phones
        })
};
