import sheep from '@/sheep';

export function createAds(){
    //创建广告
    let videoAd = null;
    if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-49f69cf6047fe3be'
        })
        videoAd.onLoad(() => {})
        videoAd.onError(e=> {console.log('显示广告异常',e)})
    }
    return videoAd;
}


export function toSeeAd(videoAd,callback) {
    if (videoAd) {
        videoAd.show().catch(() => {
            // 失败重试
            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                })
        })
    }
    //解决多次事件回调
    try {
        if (videoAd.closeHandler) {
            videoAd.offClose(videoAd.closeHandler);
        }
    } catch (e) {
        console.error(e);
    }
    // 激励广告播放异常回调函数
    videoAd.onError((err) => {
        console.log('播放广告异常',err)})
    // 关闭激励广告回调函数方法

    videoAd.closeHandler = function (res) {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
            //广告看完了，需要发放金币
            callback()
        } else {
            sheep.$helper.toast('抱歉！您观看视频中途退出无法获取奖励')
        }
    };
    videoAd.onClose(videoAd.closeHandler);
}
