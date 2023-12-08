<template>
  <!-- 规格弹窗 -->
  <su-popup :show="show" round="10" @close="emits('close')">
    <view class="ss-modal-box bg-white ss-flex-col">
      <view class="modal-header ss-flex ss-col-center">
        <view class="header-left ss-m-r-30">
          <image
            class="sku-image"
            :src="sheep.$url.cdn(state.selectedSkuPrice.pic || goodsInfo.product.pic)"
            mode="aspectFill"
          ></image>
        </view>
        <view class="header-right ss-flex-col ss-row-between ss-flex-1">
          <view class="goods-title ss-line-2">{{ goodsInfo.product.name }}</view>
          <view class="header-right-bottom ss-flex ss-col-center ss-row-between">
            <view class="ss-flex">
              <view v-if="goodsPrice.price > 0" class="price-text">
                {{ goodsPrice.price }}
              </view>
              <view class="ss-flex">
                <view
                  v-if="goodsPrice.price > 0 && goodsPrice.score > 0"
                  class="score-text ss-m-l-4"
                  >+</view
                >
                <image
                  v-if="goodsPrice.score > 0"
                  :src="sheep.$url.static('/static/img/shop/goods/score1.svg')"
                  class="score-img"
                ></image>
                <view v-if="goodsPrice.score > 0" class="score-text">
                  {{ goodsPrice.score }}
                </view>
              </view>
            </view>

            <view class="stock-text ss-m-l-20">
              {{
                state.selectedSkuPrice.stock || state.selectedSkuPrice.stock === 0
                  ? formatStock("exact", state.selectedSkuPrice.stock)
                  : formatStock("exact", goodsInfo.totalStock)
              }}
            </view>
          </view>
        </view>
      </view>
      <view class="modal-content ss-flex-1">
        <scroll-view scroll-y="true" class="modal-content-scroll" @touchmove.stop>
          <view class="sku-item ss-m-b-20" v-for="sku1 in productAttrList" :key="sku1.id">
            <view class="label-text ss-m-b-20">{{ sku1.name }}</view>
            <view class="ss-flex ss-col-center ss-flex-wrap">
              <button
                  class="ss-reset-button spec-btn"
                  v-for="sku2 in sku1.options.filter(i=>i.name)"
                  :class="[
                  {
                    'ui-BG-Main-Gradient': state.currentSkuMap[sku1.name] === sku2.name,
                  }
                ]"
                  :key="sku2.name"
                  @tap="onSelectSku(sku2.name, sku1.name)"
              >
                {{ sku2.name }}
              </button>
            </view>
          </view>
          <view class="buy-num-box ss-flex ss-col-center ss-row-between ss-m-b-40">
            <view class="label-text">购买数量</view>
            <su-number-box
              :min="1"
              :max="state.selectedSkuPrice.stock"
              :step="1"
              v-model="state.selectedSkuPrice.buyNum"
              @change="(val)=>state.selectedSkuPrice.buyNum = val"
            ></su-number-box>
          </view>
        </scroll-view>
      </view>
      <view class="modal-footer border-top">
<!--        <view-->
<!--          class="buy-box ss-flex ss-col-center ss-flex ss-col-center ss-row-center"-->
<!--          v-if="isScore"-->
<!--        >-->
<!--          <button class="ss-reset-button score-btn ui-Shadow-Main" @tap="onBuy">立即兑换</button>-->
<!--        </view>-->
        <view class="buy-box ss-flex ss-col-center ss-flex ss-col-center ss-row-center">
          <button class="ss-reset-button add-btn ui-Shadow-Main" @tap="onAddCart"
            >加入购物车</button
          >
          <button class="ss-reset-button buy-btn ui-Shadow-Main" @tap="onBuy">立即购买</button>
        </view>
      </view>
    </view>
  </su-popup>
</template>

<script setup>
  import { computed, reactive, watch } from 'vue';
  import sheep from '@/sheep';
  import { formatStock, formatPrice } from '@/sheep/hooks/useGoods';
  import { isEmpty } from 'lodash';

  const emits = defineEmits(['change', 'addCart', 'buy', 'close']);
  const props = defineProps({
    goodsInfo: {
      type: Object,
      default() {},
    },
    show: {
      type: Boolean,
      default: false,
    },
    isScore: {
      type: Boolean,
      default: false,
    },
  });

  const state = reactive({
    selectedSkuPrice: {buyNum: 1},
    currentSkuArray: [],
    currentSkuMap: {}
  });

  // 默认单规格
  if (props.goodsInfo.skus.length < 2) {
    state.selectedSkuPrice = {...props.goodsInfo.skus[0], buyNum:1,productName:props.goodsInfo.product.name}
    state.currentSkuMap = JSON.parse(state.selectedSkuPrice.spData);
  }

  const skuList = props.goodsInfo.skus;

  // 可选规格
  const skuPrices = computed(() => {
    return  props.goodsInfo.skus;
    // if (props.goodsInfo.is_sku) {
    //   skuPrices.forEach((item) => {
    //     item.goods_sku_id_arr = item.goods_sku_ids.split(',');
    //   });
    // }
    // return skuPrices;
  });

  watch(
    () => state.selectedSkuPrice,
    (newVal) => {
      emits('change', newVal);
    },
    {
      immediate: true, // 立即执行
      deep: true, // 深度监听
    },
  );

  // 可选择款式对象
  const productAttrList = computed(() => {
    return JSON.parse(props.goodsInfo.product.productAttr);
  });

  const goodsPrice = computed(() => {
    let price, score;
    if (isEmpty(state.selectedSkuPrice)) {
      price = props.goodsInfo.product.price;
      score = props.goodsInfo.score || 0;
    } else {
      price = state.selectedSkuPrice.price;
      score = state.selectedSkuPrice.score || 0;
    }
    return { price, score };
  });

  function onAddCart() {
    console.log('加入购物车')
    if (state.selectedSkuPrice.id) {
      if (state.selectedSkuPrice.stock < 1) {
        sheep.$helper.toast("库存不足");
      } else {
        emits("addCart", state.selectedSkuPrice);
      }
    } else {
      sheep.$helper.toast('请选择规格');
    }
  }

  function onBuy() {
    if (state.selectedSkuPrice.id) {
      if (state.selectedSkuPrice.stock < 1) {
        sheep.$helper.toast("库存不足");
      } else {
        emits('buy', state.selectedSkuPrice);
      }
    } else {
      sheep.$helper.toast('请选择规格');
    }
  }
  // 改变禁用状态
  // function changeDisabled(isChecked = false, pid = 0, skuId = 0) {
  //   let newPrice = []; // 所有可以选择的 skuPrice
  //
  //   if (isChecked) {
  //     // 选中规格
  //     // 当前点击选中规格下的 所有可用 skuPrice
  //     for (let price of skuPrices.value) {
  //       if (price.stock <= 0) {
  //         // this.goodsNum 不判断是否大于当前选择数量，在 uni-number-box 判断，并且 取 stock 和 goods_num 的小值
  //         continue;
  //       }
  //       if (price.goods_sku_id_arr.indexOf(skuId.toString()) >= 0) {
  //         newPrice.push(price);
  //       }
  //     }
  //   } else {
  //     // 取消选中
  //     // 当前所选规格下，所有可以选择的 skuPrice
  //     newPrice = getCanUseSkuPrice();
  //   }
  //
  //   // 所有存在并且有库存未选择的规格项 的 子项 id
  //   let noChooseSkuIds = [];
  //   for (let price of newPrice) {
  //     noChooseSkuIds = noChooseSkuIds.concat(price.goods_sku_id_arr);
  //   }
  //
  //   // 去重
  //   noChooseSkuIds = Array.from(new Set(noChooseSkuIds));
  //
  //   if (isChecked) {
  //     // 去除当前选中的规格项
  //     let index = noChooseSkuIds.indexOf(skuId.toString());
  //     noChooseSkuIds.splice(index, 1);
  //   } else {
  //     // 循环去除当前已选择的规格项
  //     state.currentSkuArray.forEach((sku) => {
  //       if (sku.toString() != '') {
  //         // sku 为空是反选 填充的
  //         let index = noChooseSkuIds.indexOf(sku.toString());
  //         if (index >= 0) {
  //           // sku 存在于 noChooseSkuIds
  //           noChooseSkuIds.splice(index, 1);
  //         }
  //       }
  //     });
  //   }
  //
  //   // 当前已选择的规格大类
  //   let chooseSkuKey = [];
  //   if (!isChecked) {
  //     // 当前已选择的规格大类
  //     state.currentSkuArray.forEach((sku, key) => {
  //       if (sku != '') {
  //         // sku 为空是反选 填充的
  //         chooseSkuKey.push(key);
  //       }
  //     });
  //   } else {
  //     // 当前点击选择的规格大类
  //     chooseSkuKey = [pid];
  //   }
  //
  //   for (let i in skuList) {
  //     // 当前点击的规格，或者取消选择时候 已选中的规格 不进行处理
  //     if (chooseSkuKey.indexOf(skuList[i]['id']) >= 0) {
  //       continue;
  //     }
  //
  //     for (let j in skuList[i]['children']) {
  //       // 如果当前规格项 id 不存在于有库存的规格项中，则禁用
  //       if (noChooseSkuIds.indexOf(skuList[i]['children'][j]['id'].toString()) >= 0) {
  //         skuList[i]['children'][j]['disabled'] = false;
  //       } else {
  //         skuList[i]['children'][j]['disabled'] = true;
  //       }
  //     }
  //   }
  // }
  // 当前所选规格下，获取所有有库存的 skuPrice
  // function getCanUseSkuPrice() {
  //   let newPrice = [];
  //
  //   for (let price of skuPrices.value) {
  //     if (price.stock <= 0) {
  //       // || price.stock < this.goodsNum		不判断是否大于当前选择数量，在 uni-number-box 判断，并且 取 stock 和 goods_num 的小值
  //       continue;
  //     }
  //     var isOk = true;
  //
  //     state.currentSkuArray.forEach((sku) => {
  //       // sku 不为空，并且，这个 条 skuPrice 没有被选中,则排除
  //       if (sku.toString() != '' && price.goods_sku_id_arr.indexOf(sku.toString()) < 0) {
  //         isOk = false;
  //       }
  //     });
  //
  //     if (isOk) {
  //       newPrice.push(price);
  //     }
  //   }
  //
  //   return newPrice;
  // }
  // 选择规格
  // 选择规格
  function onSelectSku(childName, pname) {
    const dbChildName = state.currentSkuMap[pname];
    if (!dbChildName || dbChildName !== childName) {
      state.currentSkuMap[pname] = childName;
    } else {
      delete state.currentSkuMap[pname];
    }
    //判断是否符合选中sku
    for (let i = 0; i < skuList.length; i++) {
      const skus = JSON.parse(skuList[i].spData);
      if (Object.keys(skus).length !== Object.keys(state.currentSkuMap).length) {
        state.selectedSkuPrice = {};
        return;
      }
      const list = Object.keys(skus).filter(item => skus[item] !== state.currentSkuMap[item]);
      if (!list || list.length < 1) {
        state.selectedSkuPrice = {...skuList[i],buyNum:1,productName:props.goodsInfo.product.name};
        return;
      }
    }
  }

  // changeDisabled(false);
</script>

<style lang="scss" scoped>
  // 购买
  .buy-box {
    padding: 10rpx 0;

    .add-btn {
      width: 356rpx;
      height: 80rpx;
      border-radius: 40rpx 0 0 40rpx;
      background-color: var(--ui-BG-Main-light);
      color: var(--ui-BG-Main);
    }

    .buy-btn {
      width: 356rpx;
      height: 80rpx;
      border-radius: 0 40rpx 40rpx 0;
      background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
      color: #fff;
    }
    .score-btn {
      width: 100%;
      margin: 0 20rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
      color: #fff;
    }
  }

  .ss-modal-box {
    border-radius: 30rpx 30rpx 0 0;
    max-height: 1000rpx;

    .modal-header {
      position: relative;
      padding: 80rpx 20rpx 40rpx;

      .sku-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
      }

      .header-right {
        height: 160rpx;
      }

      .close-icon {
        position: absolute;
        top: 10rpx;
        right: 20rpx;
        font-size: 46rpx;
        opacity: 0.2;
      }

      .goods-title {
        font-size: 28rpx;
        font-weight: 500;
        line-height: 42rpx;
      }
      .score-img {
        width: 36rpx;
        height: 36rpx;
        margin: 0 4rpx;
      }
      .score-text {
        font-size: 30rpx;
        font-weight: 500;
        color: $red;
        font-family: OPPOSANS;
      }
      .price-text {
        font-size: 30rpx;
        font-weight: 500;
        color: $red;
        font-family: OPPOSANS;
        &::before {
          content: '￥';
          font-size: 30rpx;
          font-weight: 500;
          color: $red;
        }
      }

      .stock-text {
        font-size: 26rpx;
        color: #999999;
      }
    }

    .modal-content {
      padding: 0 20rpx;

      .modal-content-scroll {
        max-height: 600rpx;

        .label-text {
          font-size: 26rpx;
          font-weight: 500;
        }

        .buy-num-box {
          height: 100rpx;
        }

        .spec-btn {
          height: 60rpx;
          min-width: 100rpx;
          padding: 0 30rpx;
          background: #f4f4f4;
          border-radius: 30rpx;
          color: #434343;
          font-size: 26rpx;
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
        .disabled-btn {
          font-weight: 400;
          color: #c6c6c6;
          background: #f8f8f8;
        }
      }
    }
  }
</style>
