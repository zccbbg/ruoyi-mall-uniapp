<template>
  <s-layout title="购物车" tabbar="/pages/index/cart" :bgStyle="{ color: '#fff' }">
    <s-empty
      v-if="state.list.length === 0"
      text="购物车空空如也,快去逛逛吧~"
      icon="/static/cart-empty.png"
    />

    <!-- 头部 -->
    <view class="cart-box ss-flex ss-flex-col ss-row-between" v-if="state.list.length">
      <view class="cart-header ss-flex ss-col-center ss-row-between ss-p-x-30">
        <view class="header-left ss-flex ss-col-center ss-font-26">
          共
          <text class="goods-number ui-TC-Main ss-flex">{{ state.list.length }}</text>
          件商品
        </view>
        <view class="header-right">
          <button v-if="state.editMode" class="ss-reset-button" @tap="state.editMode = false">
            取消
          </button>
          <button v-else class="ss-reset-button ui-TC-Main" @tap="state.editMode = true">
            编辑
          </button>
        </view>
      </view>
      <!-- 内容 -->
      <view class="cart-content ss-flex-1 ss-p-x-30 ss-m-b-40">
        <view class="goods-box ss-r-10 ss-m-b-14" v-for="item in state.list" :key="item.id">
          <view class="ss-flex ss-col-center">
            <checkbox-group
              @change="onSelectSingle(item.id)"
              class="check-box ss-flex ss-col-center ss-p-l-10"
            >
              <label class="radio ss-flex">
                <checkbox
                  :checked="state.selectedIds.includes(item.id)"
                  color="var(--ui-BG-Main)"
                  style="transform: scale(0.8)"
                />
              </label>
            </checkbox-group>
            <s-goods-item
              :title="item.productName"
              :img="item.pic"
              :price="item.price"
              :skuText="item.spDataValue"
              priceColor="#FF3000"
              :titleWidth="400"
            >
              <template v-if="!state.editMode" v-slot:tool>
                <su-number-box
                  :min="0"
                  :step="1"
                  v-model="item.quantity"
                  @change="onNumberChange($event, item)"
                ></su-number-box>
              </template>
            </s-goods-item>
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <su-fixed bottom :val="48" placeholder v-if="state.list.length > 0" :isInset="false">
        <view class="cart-footer ss-flex ss-col-center ss-row-between ss-p-x-30 border-bottom">
          <view class="footer-left ss-flex ss-col-center">
            <checkbox-group @change="onSelectAll" class="check-box ss-flex ss-col-center ss-p-r-30">
              <label class="radio ss-flex">
                <checkbox
                  :checked="state.isAllSelected"
                  color="var(--ui-BG-Main)"
                  style="transform: scale(0.8)"
                />
                <view class="ss-m-l-8"> 全选 </view>
              </label>
            </checkbox-group>
            <text>合计：</text>
            <view class="text-price price-text">
              {{ state.totalPriceSelected }}
            </view>
          </view>
          <view class="footer-right">
            <button
              v-if="state.editMode"
              class="ss-reset-button ui-BG-Main-Gradient pay-btn ui-Shadow-Main"
              @tap="onDelete"
            >
              删除
            </button>
            <button
              v-else
              class="ss-reset-button ui-BG-Main-Gradient pay-btn ui-Shadow-Main"
              @tap="onConfirm"
            >
              去结算
              {{ state.selectedIds?.length ? `(${state.selectedIds.length})` : '' }}
            </button>
          </view>
        </view>
      </su-fixed>
    </view>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { computed, reactive, unref } from 'vue';
  import {onLoad, onShow} from "@dcloudio/uni-app";

  const sys_navBar = sheep.$platform.navbar;
  const cart = sheep.$store('cart');

  const state = reactive({
    editMode: false,
    list: computed(() => cart.list),
    selectedList: [],
    selectedIds: computed(() => cart.selectedIds),
    isAllSelected: computed(() => cart.isAllSelected),
    totalPriceSelected: computed(() => cart.totalPriceSelected),
  });

  // 单选选中
  function onSelectSingle(id) {
    cart.selectSingle(id);
  }
  // 全选
  function onSelectAll() {
    cart.selectAll(!state.isAllSelected);
  }

  // 结算
  function onConfirm() {
    let goods_list = [];
    state.selectedList = state.list.filter((item) => state.selectedIds.includes(item.id));
    state.selectedList.map((item) => {
      goods_list.push({
        goods_id: item.productId,
        goods_num: item.quantity,
        skuId: item.skuId
      });
    });
    if (goods_list.length === 0) {
      sheep.$helper.toast('请选择商品');
      return;
    }
    sheep.$router.go('/pages/order/confirm', {
      data: JSON.stringify({
        order_type: 'goods',
        goods_list,
        from: 'cart',
      }),
    });
  }

  function onNumberChange(e, cartItem) {
    if (e === 0) {
      cart.delete(cartItem.id);
      return;
    }
    cart.update({
      id: cartItem.id,
      quantity: e,
    });
  }
  async function onDelete() {
    cart.delete(state.selectedIds);
  }

</script>

<style lang="scss" scoped>
  :deep() {
    checkbox .wx-checkbox-input {
      border-radius: 50% !important;
      color: #ffffff !important;
    }

    checkbox .wx-checkbox-input.wx-checkbox-input-checked {
      color: #fff;
      background: var(--ui-BG-Main);
    }

    .wx-checkbox-input.wx-checkbox-input-checked {
      border: none !important;
    }

    .uni-checkbox-input {
      border-radius: 50% !important;
      color: #ffffff !important;
    }

    .uni-checkbox-input:hover {
      border-color: #d1d1d1 !important;
    }
  }

  :deep(.ui-fixed) {
    height: 72rpx;
  }

  .cart-box {
    width: 100%;

    .cart-header {
      height: 70rpx;
      background-color: #f6f6f6;
      width: 100%;
      position: fixed;
      left: 0;
      top: v-bind('sys_navBar') rpx;
      z-index: 1000;
      box-sizing: border-box;
    }

    .cart-footer {
      height: 100rpx;
      background-color: #fff;

      .pay-btn {
        width: 180rpx;
        height: 70rpx;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        border-radius: 40rpx;
      }
    }

    .cart-content {
      margin-top: 70rpx;
      .goods-box {
        background-color: #fff;
      }
    }
  }
</style>
