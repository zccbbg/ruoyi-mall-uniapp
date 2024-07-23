<template>
  <view class="see_ads">请先观看广告</view>
  <view class="btn-content">
    <button class="ss-reset-button see-btn" @tap="seeAds">立即观看</button>
  </view>
  <su-popup :show="showPop" round="10" :showClose="true" @close="showPop=false" type="center">
    <view class="pop-content">
      <view>使用微信扫描下方二维码，观看完广告获取验证码</view>
      <image :src="url" class="qr-img"/>
      <view class="flex-center">
        <uni-easyinput
            class="ss-flex-1 ss-p-l-22"
            :inputBorder="true"
            :clearable="false"
            v-model="qrcode"
            placeholder="请输入验证码"
        ></uni-easyinput>
        <button class="ss-reset-button confirm-btn" @tap="confirmOk"
        >提交</button>
      </view>
    </view>
  </su-popup>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {createAds,toSeeAd} from "@/sheep/hooks/useAds";
import sheep from "@/sheep";

const videoAd = ref(null)
const emits = defineEmits(['onFinish']);
const showPop = ref(false)


const url = ref(null)
function showPops(){
  showPop.value = true
  sheep.$api.user.getMiniImg({scene: '2'}).then(res=>{
    url.value = 'data:image/png;base64,' + res.data
  })
}
defineExpose({
  initAds
});

async function initAds(firstShow){
  // #ifdef MP
  videoAd.value = await createAds()
  if (firstShow) {
    seeAds()
  }
  // #endif


  // #ifdef H5
  // showPops()
  // #endif
}

function confirmOk(){

}

const qrcode = ref(null)

function seeAds(){
  // #ifdef MP
  toSeeAd(videoAd.value,()=>{
    //看完广告了
    setTimeout(()=>{
      emits('onFinish')

    },100)
  })
  // #endif
  // #ifdef H5
  // showPops()
  // #endif
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
.qr-img {
  width: 300rpx !important;
  height: 300rpx !important;
  img {
    width: 300rpx !important;
    height: 300rpx !important;
  }
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
.pop-content {
  min-width: 300rpx;
  padding: 40rpx;
  min-height: 300rpx;
  text-align: center;
}
.confirm-btn {
  width: 120rpx;
  border-radius: 0 35rpx 35rpx 0;
  font-size: 30rpx;
  font-weight: 500;
  box-shadow: 0 0.2em 0.5em rgba(#ff6000, 0.4);
  background: linear-gradient(90deg, #ff6000, #fe832a);
  color: #fff;
}
</style>
