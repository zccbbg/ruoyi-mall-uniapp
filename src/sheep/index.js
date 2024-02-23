import $api from '@/sheep/api';
import $url from '@/sheep/url';
import $router from '@/sheep/router';
import $platform from '@/sheep/platform';
import $helper from '@/sheep/helper';
import zIndex from '@/sheep/config/zIndex.js';
import $store from '@/sheep/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/zh-cn';
import {Base64} from "js-base64";

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(duration);

const sheep = {
  $api,
  $store,
  $url,
  $router,
  $platform,
  $helper,
  $zIndex: zIndex,
};

// 加载Shopro底层依赖
export async function ShoproInit() {
  // 应用初始化
  await $store('app').init();

  // 平台初始化加载(各平台provider提供不同的加载流程)
  $platform.load();

  // if (process.env.NODE_ENV === 'development') {
  //   ShoproDebug();
  // }

  // 获取微信授权code
  /* #ifdef H5 */
  const code = getUrlCode().code;
  if (!code && !sheep.$store('app').authInfo ){
    if (!sheep.$store('user').isLogin){
      window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          import.meta.env.SHOPRO_APPID +
          "&redirect_uri=" + encodeURIComponent(import.meta.env.SHOPRO_FRONT_DOMAIN + "/#/") +
          "&response_type=code&scope=snsapi_base#wechat_redirect";
    }
  }else {
    const data = Base64.encode(JSON.stringify({code}));
    sheep.$store('app').authInfo = await sheep.$api.user.getWechatUserAuth(data);
    if (sheep.$store('user').isLogin) {
      await sheep.$api.user.recordLogin();
    }
  }
  /* #endif */

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


// 开发模式
function ShoproDebug() {
  // 开发环境引入vconsole调试
  // #ifdef H5
  // import("vconsole").then(vconsole => {
  // 	new vconsole.default();
  // });
  // #endif

  // 同步前端页面到后端
  // $api.app.pageSync(ROUTES);
}

export default sheep;
