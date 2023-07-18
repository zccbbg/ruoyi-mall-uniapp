<!-- 短信登录 - smsLogin  -->
<template>
  <view>
    <!-- 标题栏 -->
    <view class="head-box ss-m-b-60">
      <view class="ss-flex ss-m-b-20">
<!--        <view class="head-title-active ss-m-r-40" @tap="showAuthModal('accountLogin')"-->
<!--          >账号登录</view-->
<!--        >-->
        <view class="head-title head-title-line head-title-animation">短信登录</view>
      </view>
<!--      <view class="head-subtitle">未注册手机号请先点击下方立即注册</view>-->
    </view>

    <!-- 表单项 -->
    <uni-forms
      ref="smsLoginRef"
      v-model="state.model"
      :rules="state.rules"
      validateTrigger="bind"
      labelWidth="140"
      labelAlign="center"
    >
      <uni-forms-item name="mobile" label="手机号">
        <uni-easyinput
          placeholder="请输入手机号"
          v-model="state.model.mobile"
          :inputBorder="false"
          type="number"
        >
          <template v-slot:right>
            <button
              class="ss-reset-button code-btn code-btn-start"
              :disabled="state.isMobileEnd"
              :class="{ 'code-btn-end': state.isMobileEnd }"
              @tap="getSmsCode('smsLogin', state.model.mobile)"
            >
              {{ getSmsTimer('smsLogin') }}
            </button>
          </template>
        </uni-easyinput>
      </uni-forms-item>

      <uni-forms-item name="code" label="验证码">
        <uni-easyinput
          placeholder="请输入验证码"
          v-model="state.model.code"
          :inputBorder="false"
          type="number"
          maxlength="4"
        >
          <template v-slot:right>
            <button class="ss-reset-button login-btn-start" @tap="smsLoginSubmit"> 登录 </button>
          </template>
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>

<!--    <button class="ss-reset-button type-btn" @tap="showAuthModal('smsRegister')"> 立即注册 </button>-->
  </view>
</template>

<script setup>
import {reactive, ref, unref} from 'vue';
import sheep from '@/sheep';
import {code, mobile} from '@/sheep/validate/form';
import {closeAuthModal, getSmsCode, getSmsTimer, showAuthModal} from '@/sheep/hooks/useModal';
import {Base64} from 'js-base64'
import {onLoad} from "@dcloudio/uni-app";

const smsLoginRef = ref(null);

  const props = defineProps({
    agreeStatus: {
      type: Boolean,
      default: false,
    },
  });

  // 数据
  const state = reactive({
    isMobileEnd: false, // 手机号输入完毕
    codeText: '获取验证码',
    model: {
      mobile: '', // 手机号
      code: '', // 验证码
      uuid: null, // uuid
      authInfo: {}
    },
    rules: {
      code,
      mobile,
    },
  });

  // 2.短信登录
  async function smsLoginSubmit() {
    const validate = await unref(smsLoginRef)
      .validate()
      .catch((error) => {
        console.log('error: ', error);
      });
    if (!validate) return;

    if (!props.agreeStatus) {
      sheep.$helper.toast('请勾选同意');
      return;
    }
    state.model.uuid = sheep.$store('user').getUUID()
    const data = Base64.encode(JSON.stringify(state.model))
    sheep.$api.user.smsLogin(data).then((response) => {
      sheep.$helper.toast('登录成功')
      closeAuthModal();
    })
  }
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

  onLoad( async () => {
    let appid = "wx0a5f3d7cabd3ebbf"; //微信APPid
    let code = getUrlCode().code;
    let local = window.location.href;
    if (!code) {
      if (sheep.$platform.name !== 'H5') {
        //微信环境才去拿code
        //不存在就打开上面的地址进行授权
        window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appid +
            "&redirect_uri=" + encodeURIComponent(local) +
            "&response_type=code&scope=snsapi_base#wechat_redirect";
      }
    }else {
      const data = Base64.encode(JSON.stringify({
        code: code
      }))
      state.model.authInfo = await sheep.$api.user.getWechatUserAuth(data)
    }
  })
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
