<template>
	<view>
    <s-layout title="首页" v-show="notSeeAds">
      <s-ads @onFinish="confirmOk" ref="sAdsRef"/>
    </s-layout>
		<s-layout title="首页" navbar="custom" tabbar="/pages/index/index" :navbarStyle="template.style?.navbar"
			onShareAppMessage v-if="!notSeeAds">
			<!--轮播图 -->
			<!--      <view class="banner-content">-->
			<!--        <swiper class="swiper-content" :indicator-dots="true" :autoplay="true">-->
			<!--          <swiper-item v-for="it in bannerList" :key="it.id" @tap="clickBanner(it)">-->
			<!--            <image :src="it.src" class="img"/>-->
			<!--          </swiper-item>-->
			<!--        </swiper>-->
			<!--      </view>-->

			<!-- 分类 -->
			<!--      <view class="category-content">-->
			<!--        <view class="category-item" v-for="(it,idx) in categoryList"-->
			<!--              @tap="sheep.$router.go('/pages/goods/list', { categoryId: it.id })">-->
			<!--          <image :src="it.icon" class="ct-icon"/>-->
			<!--          <view class="ct-text">{{it.name}}</view>-->
			<!--        </view>-->
			<!--      </view>-->

			<!-- 广告模块 -->
			<!--      <s-popup-image />-->
			<!--      <view class="icon-text">-->
			<!--        <view class="text-info">-->
			<!--          <view class="left"></view>-->
			<!--          <view class="center">-->
			<!--            推荐商品-->
			<!--          </view>-->
			<!--          <view class="right"></view>-->
			<!--        </view>-->
			<!--      </view>-->
			<view class="goods-block">
				<s-goods-card :data="goodsCard.data" :styles="goodsCard.style"/>
			</view>
		</s-layout>
	</view>
</template>

<script setup>
import {
  computed, nextTick,
  ref
} from 'vue';
  import {
    onLoad,
    onPageScroll,
    onPullDownRefresh,
    onReachBottom,
    onShareAppMessage, onShow
  } from '@dcloudio/uni-app';
	import sheep from '@/sheep';
	import $share from '@/sheep/platform/share';
	//#ifdef H5
	import weixin from '@/sheep/libs/sdk-h5-weixin';
	//#endif

  const sAdsRef=ref(null)

	const categoryList = ref([])
	const goodsCard = {
		"data": {
			"mode": 2,
			"goodsFields": {
				"title": {
					"show": 1,
				},
				"subtitle": {
					"show": 1,
				},
				"price": {
					"show": 1,
				},
				"original_price": {
					"show": 1,
				},
				"sales": {
					"show": 1,
				},
				"stock": {
					"show": 0,
				}
			},
			"buyNowStyle": {
				// "mode": 2,
				// "text": "立即购买",
				// "color1": "#E9B461",
				// "color2": "#EECC89",
				// "src": "\/storage\/decorate\/20221115\/4782356b4587dc4f4a218f2540a0bafc.png",
				// "right": '20rpx',
				// "bottom":"18rpx"
			},
			"tagStyle": {
				"show": 0,
				"src": ""
			},
			params: {
				orderField: 'sort',
				orderSort: 'asc'
			},
			"borderRadiusTop": 6,
			"borderRadiusBottom": 6,
			"space": 8
		},
		"style": {
			"background": {
				"type": "color",
				"bgImage": "",
				"bgColor": ""
			},
			"marginLeft": 8,
			"marginRight": 8,
			"marginTop": 0,
			"marginBottom": 10,
			"borderRadiusTop": 0,
			"borderRadiusBottom": 0,
			"padding": 0
		}
	};

	// 隐藏原生tabBar
	uni.hideTabBar();

  const notSeeAds = ref(false)

	const template = computed(() => sheep.$store('app').template.home);
  const barHeight = ref(0)


  function generateCaptcha(len) {
    let captcha = '';
    const chars = '0123456789';
    const charLength = chars.length;
    for (let i = 0; i < len; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return captcha;
  }
  onShow(()=>{
    nextTick(()=>{
      setTimeout(()=>{
        if (uni.getStorageSync('notSeeAds')) {
          sAdsRef.value.initAds(true)
        }
      },200)
    })
  })
  function confirmOk(){
    //看完广告了
    uni.setStorageSync('notSeeAds',false)
    notSeeAds.value = false
    init({})
    if (uni.getStorageSync("shouldShowResult")) {
      //展示码
      setTimeout(()=>{
        const code = generateCaptcha(6)
        sheep.$api.data.generateVerifiedCode({code})
        uni.showModal({
          title: '恭喜您获得验证码',
          content: code,
          confirmText: '立即复制',
          showCancel: false,
          success: async function (res) {
            if (res.confirm) {
              sheep.$helper.copyText(code);
            }
          },
        });
        uni.setStorageSync('shouldShowResult',false)
      },500)

    }
  }

	onLoad(async (options) => {
    const statusBarHeight = sheep.$platform.device.statusBarHeight;
    barHeight.value = (statusBarHeight + 54)+'px'
		// #ifdef MP
		// 小程序识别二维码
    console.log('option scene',options.scene)

    //todo
    options.scene = '3'

		if (options.scene && ['1','2'].includes(options.scene)) {
      uni.setStorageSync('notSeeAds',true)
      notSeeAds.value = true
      if ('2' === options.scene) {
        //需要展示码
        uni.setStorageSync('shouldShowResult',true)
      } else{
        uni.setStorageSync('shouldShowResult',false)
      }
      //看广告
      console.log('可以看广告了')
      return
		}
		// #endif
    uni.setStorageSync('shouldShowResult',false)
    notSeeAds.value = uni.getStorageSync('notSeeAds')
    init(options)
	});
  function init(options) {
    // 预览模板
    if (options.templateId) {
      sheep.$store('app').init(options.templateId);
    }

    // 解析分享信息
    if (options.spm) {
      $share.decryptSpm(options.spm);
    }

    // 进入指定页面(完整页面路径)
    if (options.page) {
      sheep.$router.go(decodeURIComponent(options.page));
    }
    getCategoryList()
    //#ifdef H5
    setOpenShare()
    //#endif
  }
	onShareAppMessage((res) => {
		let shareData = {
			title: '邀请好友领取海量现金券!',
			desc: '我正在使用xxxApp，赶紧跟我一起来体验！',
			link: "https://mall.ichengle.top/uni/",
			imgUrl: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png'
		}
		return {
			...shareData
		}
	});
	// 下拉刷新
	onPullDownRefresh(() => {
		sheep.$store('app').init();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 800);
	});
	// 上拉加载更多
	onReachBottom(() => {
		// 该事件必须申明,子组件才会触发该事件
	})
	onPageScroll(() => {});
	//#ifdef H5
	// 微信h5分享；
	function setOpenShare() {
		let currentUrl = location.href //获取当前页面链接

		let shareData = {
			title: '邀请好友领取海量现金券!',
			desc: '我正在使用xxxApp，赶紧跟我一起来体验！',
			link: "https://mall.ichengle.top/uni/",
			imgUrl: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png'
		}
		console.log("更新分享", shareData)
		weixin.updateShareInfo(shareData);
	}
	//#endif
	// 获取商品分类
	function getCategoryList() {
		sheep.$api.category.list().then(res => {
			categoryList.value = res
		})
	}
</script>

<style lang="scss" scoped>
  .see_ads {
    margin: 400rpx 40rpx 60rpx 40rpx;
    text-align: center;
    color: red;
  }
  .btn-content{
    display: flex;
    justify-content: center;
  }
  .see-btn {
    width: 190rpx;
    height: 70rpx;
    font-size: 28rpx;
    border: 2rpx solid #dfdfdf;
    border-radius: 35rpx;
    font-weight: 400;
    color: #595959;
  }
	.goods-block {
    /* #ifdef MP-WEIXIN */
		margin: v-bind(barHeight) 20rpx 10rpx 20rpx;
    /* #endif */

    /* #ifdef H5 */
    margin: 90rpx 20rpx 10rpx 20rpx;
    /* #endif */
	}

	.icon-text {
		display: flex;
		justify-content: center;
		margin-bottom: 24rpx;

		.text-info {
			display: flex;
			align-items: center;
			width: 440rpx;

			.left {
				width: 108rpx;
				height: 2rpx;
				background: #D8D8D8;
			}

			.center {
				width: 128rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				line-height: 44rpx;
				margin-left: 48rpx;
				margin-right: 48rpx;
			}

			.right {
				width: 108 rpx;
				height: 2 rpx;
				background: #D8D8D8;
			}
		}
	}

	.category-content {
		margin-left: 40rpx;
		margin-right: 40rpx;
		display: grid;
		grid-template-columns: auto auto auto 112rpx;

		//grid-column-gap: v-bind(ml);
		.category-item {
			width: 112rpx;
			margin-bottom: 48rpx;


			.ct-icon {
				width: 88rpx;
				height: 88rpx;
				padding-left: 12rpx;
			}

			.ct-text {
				margin-top: 16rpx;
			}
		}

	}
</style>
