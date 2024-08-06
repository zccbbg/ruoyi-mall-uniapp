<template>
  <s-layout title="获取信息" v-show="seeAds" :show-header-button="false">
    <s-ads @onFinish="confirmOk" ref="sAdsRef"/>
  </s-layout>
  <s-layout title="获取信息" v-if="!seeAds" :show-header-button="false">
    <uni-popup ref="popupRef" type="dialog">
      <uni-popup-dialog :content="account" :duration="2000" :before-close="true" @close="close" @confirm="confirm" confirm-text="立即复制" :show-close="false"></uni-popup-dialog>
    </uni-popup>
  </s-layout>
</template>

<script setup>

import {nextTick, ref} from "vue";
import {onLoad, onShow} from "@dcloudio/uni-app";
import sheep from '@/sheep';

const seeAds = ref(false)
const sAdsRef = ref(null)
const appType = ref(null)
const popupRef = ref(null)
const account = ref("")
async function confirmOk() {
  //看完广告了
  seeAds.value = false
  //展示码
  setTimeout(async () => {
    account.value = await sheep.$api.noAuth.getAppAccount(appType.value)
    popupRef.value.open()
  }, 500)

}

function close() {

}

function confirm() {
  sheep.$helper.copyText(account.value);
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

onLoad(async (options) => {
  if (options.type) {
    appType.value = options.type
    seeAds.value = true
    return
  }
});
</script>

<style scoped lang="scss">

</style>
