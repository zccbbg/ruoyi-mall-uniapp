export default {
    data() {
       return {
            share:{
               title: '自定义分享标题',
               imageUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
            }
       }
    },
    onShareAppMessage(res) { //发送给朋友
       let shareData = {
       	title: '邀请好友领取海量现金券!',
       	desc: '我正在使用xxxApp，赶紧跟我一起来体验！',
       	link: "https://mall.ichengle.top/uni/",
       	imgUrl: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png'
       }
       return {
       	...shareData
       }
    },
    onShareTimeline(res) {//分享到朋友圈
        return {
            title: this.share.title,
            imageUrl: this.share.imageUrl,
        }
    },
}