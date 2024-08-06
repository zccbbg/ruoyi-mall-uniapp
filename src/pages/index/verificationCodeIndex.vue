<template>
  <s-layout title="获取验证码" v-show="seeAds" :show-header-button="false">
    <s-ads @onFinish="confirmOk" ref="sAdsRef"/>
  </s-layout>
  <s-layout title="获取验证码" v-if="!seeAds" :show-header-button="false">
    <uni-popup ref="popupRef" type="dialog">
      <uni-popup-dialog :content="verificationCode" title="恭喜您获得验证码！" :duration="2000" :before-close="true" @close="close" @confirm="confirm" confirm-text="立即复制" :show-close="false"></uni-popup-dialog>
    </uni-popup>
  </s-layout>
</template>

<script setup>

import {nextTick, ref} from "vue";
import {onLoad, onShow} from "@dcloudio/uni-app";
import sheep from '@/sheep';

const seeAds = ref(false)
const sAdsRef = ref(null)
const popupRef = ref(null)
const verificationCode = ref("")
async function confirmOk() {
  //看完广告了
  seeAds.value = false
  //展示码
  setTimeout(async () => {
    const res = await sheep.$api.noAuth.generateVerifiedCode()
    verificationCode.value = res.data
    popupRef.value.open()
  }, 500)

}

function close() {

}

function confirm() {
  sheep.$helper.copyText(verificationCode.value);
}

onShow(() => {
  nextTick(() => {
    setTimeout(() => {
      if (seeAds.value) {
        sAdsRef.value.initAds(false)
      }
    }, 200)
  })
})

onLoad( () => {
  seeAds.value = true
});
</script>

<style scoped lang="scss">

</style>
