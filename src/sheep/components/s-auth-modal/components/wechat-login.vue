<template>
<view>
<!--  <view class="head-box ss-flex-col">-->
<!--    <view class="ss-flex ss-m-b-20">-->
<!--      <view class="head-title ss-m-r-40 head-title-animation">微信登录</view>-->
<!--    </view>-->
<!--  </view>-->
  <view>欢迎您登录【若依商城电商系统】</view>
  <view style="margin-top: 200rpx">
    <button class="ss-reset-button buy-btn ui-Success-Main" open-type="getPhoneNumber"
            @getphonenumber="wechatLogin">
      <view class="ss-flex">
<!--        <image class="auto-login-img" :src="sheep.$url.static('/image/weixin.svg')"/>-->
        <view>手机号快捷登录</view>
      </view>
    </button>
  </view>

  <view class="agreement-text ss-flex">
    登录遇到问题？点此
    <button class="btnStyle" open-type="contact">联系客服</button>
  </view>
</view>
</template>

<script setup>
import sheep from '@/sheep'
import {computed,reactive} from "vue";
import { closeAuthModal } from '@/sheep/hooks/useModal';

const appInfo = computed(() => sheep.$store('app').info);

const state = reactive({
  protocol: false,
});

//勾选协议
function onChange() {
  state.protocol = !state.protocol;
}

async function wechatLogin(e) {
  const loginRes = await sheep.$platform.useProvider("wechat").login(e.detail);
  if (loginRes) {
    sheep.$helper.toast('登录成功')
    closeAuthModal();
  }
}

// 查看协议
function onProtocol(id, title) {
  closeAuthModal();
  sheep.$router.go('/pages/public/richtext', {
    id,
    title,
  });
}

// 请先登录提示
function handleTip(){
  uni.showToast({
    title: "请勾选我已阅读并同意《用户协议》与《隐私政策》！",
    icon: "none",
    mask: true
  });
}

</script>


<style lang="scss" scoped>
.btnStyle{
  border: none;
  font-size: 15px;
  padding: 0 !important;
  color: #82ABCC;
  margin: 0;
  background-color: transparent;
  &::after{
    border:none;
  }
}
.agreement-text{
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: calc(100% - 68rpx);
}
.buy-btn {
  width: 100%;
  height: 72rpx;
  font-weight: 500;
  font-size: 28rpx;

  border-radius: 40rpx;
  background: #0DD116;
  color: $white;
}
.auto-login-img {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}
</style>
