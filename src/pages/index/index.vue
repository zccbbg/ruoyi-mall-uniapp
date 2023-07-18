<template>
  <view>
    <s-layout
      title="首页"
      navbar="custom"
      tabbar="/pages/index/index"
      :navbarStyle="template.style?.navbar"
      onShareAppMessage
    >

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
      <view class="goods-block" >
        <s-goods-card :data="goodsCard.data" :styles="goodsCard.style" />
      </view>
    </s-layout>
  </view>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import $share from '@/sheep/platform/share';
  import {Base64} from "js-base64";

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

  const template = computed(() => sheep.$store('app').template.home);

  onLoad((options) => {
    // #ifdef MP
    // 小程序识别二维码
    if (options.scene) {
      const sceneParams = decodeURIComponent(options.scene).split('=');
      options[sceneParams[0]] = sceneParams[1];
    }
    // #endif

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
  });

  // 下拉刷新
  onPullDownRefresh(() => {
    sheep.$store('app').init();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 800);
  });

  onPageScroll(() => {});

  function getUrlCode() {
    // 截取url中的code方法
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
      }
    }
    console.log(theRequest);
    return theRequest;
  }


  onLoad(async () => {
    const code = getUrlCode().code;
    if (code){
      const data = Base64.encode(JSON.stringify({code}));
      sheep.$store('app').authInfo = await sheep.$api.user.getWechatUserAuth(data);
    }
  })

  // 获取商品分类
  function getCategoryList(){
    sheep.$api.category.list().then(res => {
      categoryList.value = res
    })
  }
</script>

<style lang="scss" scoped>
.goods-block{
  margin: 100rpx 20rpx;
}
.icon-text{
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
    .center{
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
      width: 108rpx;
      height: 2rpx;
      background: #D8D8D8;
    }
  }
}

.category-content{
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
