<!-- 短信注册 - smsRegister  -->
<template>
  <view>
    <!-- 标题栏 -->
    <view class="head-box ss-m-b-60">
      <view class="head-title ss-m-b-20">注册</view>
      <view class="head-subtitle">请使用本人手机号完成注册</view>
    </view>

    <!-- 表单项 -->
    <uni-forms
      ref="smsRegisterRef"
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
          type="number"
          :inputBorder="false"
        >
          <template v-slot:right>
            <button
              class="ss-reset-button code-btn code-btn-start"
              :disabled="state.isMobileEnd"
              :class="{ 'code-btn-end': state.isMobileEnd }"
              @tap="send()"
            >
              {{ getSmsTimer('smsRegister') }}
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
        ></uni-easyinput>
      </uni-forms-item>

      <uni-forms-item name="password" label="密码">
        <uni-easyinput
          type="password"
          placeholder="请输入密码"
          v-model="state.model.password"
          :inputBorder="false"
        >
          <template v-slot:right>
            <button class="ss-reset-button login-btn-start" @tap="smsRegisterSubmit"> 注册 </button>
          </template>
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>

    <button class="ss-reset-button type-btn" @tap="showAuthModal('accountLogin')">
      返回登录
    </button>
  </view>
</template>

<script setup>
  import { computed, ref, reactive, unref } from 'vue';
  import sheep from '@/sheep';
  import { code, mobile, password } from '@/sheep/validate/form';
  import { showAuthModal, closeAuthModal, getSmsCode, getSmsTimer } from '@/sheep/hooks/useModal';
  import {Base64} from 'js-base64'

  const props = defineProps({
    agreeStatus: {
      type: Boolean,
      default: false,
    },
  });

  const smsRegisterRef = ref(null);
  const isLogin = computed(() => sheep.$store('user').isLogin);

  // 数据
  const state = reactive({
    isMobileEnd: false, // 手机号输入完毕
    model: {
      mobile: '', // 手机号
      code: '', // 验证码
      password: '', // 密码
      uuid: '', //uuid
    },
    rules: {
      code,
      mobile,
      password,
    },
  });

  // 3.短信注册
  async function smsRegisterSubmit() {
    const validate = await unref(smsRegisterRef)
      .validate()
      .catch((error) => {
        console.log('error: ', error);
      });
    if (!validate) return;

    if (!props.agreeStatus) {
      sheep.$helper.toast('请勾选同意');
      return;
    }
    new Promise((resolve, reject) => {
      let code = getUrlCode().code; //是否存在code
      console.log('code:',code)
      if (!code) {
        //不存在就打开上面的地址进行授权
        window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            import.meta.env.SHOPRO_APPID +
            "&redirect_uri=" + encodeURIComponent(import.meta.env.SHOPRO_FRONT_DOMAIN + "/#/pages/index/user") +
            "&response_type=code&scope=snsapi_base#wechat_redirect";
        code = getUrlCode().code
      }
      if (code){
        resolve(code)
      }
      else {
        reject('code error')
      }
    }).then(
        value => {
          state.model.uuid = sheep.$store('user').getUUID()
          sheep.$api.user.smsRegister({
            ...state.model,
            wechatCode: value
          }).then((res) => {
            closeAuthModal();
            uni.showToast({
              title: '注册成功',
              icon: 'none',
              mask: true,
            });
          });
        }
    ).catch(err => {
      sheep.$helper.toast(err)
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

  // 发送验证码
  async function send(){
    sheep.$api.user.validatePhone(Base64.encode(state.model.mobile)).then((res) => {
      console.log('res:',res)
      if (res && res.ifSuccess){
    getSmsCode('smsRegister', state.model.mobile)
      }
    })

  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
