<template>
  <!-- 商品卡片 -->
  <view>
    <!-- 1 100%宽卡片列表-->
    <view v-if="mode === 1 && state.goodsList.length" class="goods-sl-box">
      <view
          class="goods-box"
          v-for="item in state.goodsList"
          :key="item.id"
          :style="[{ marginBottom: data.space * 2 + 'rpx' }]"
      >
        <s-goods-column
            class=""
            size="sl"
            :goodsFields="goodsFields"
            :tagStyle="tagStyle"
            :data="item"
            :titleColor="goodsFields.title?.color"
            :subTitleColor="goodsFields.subtitle.color"
            :topRadius="data.borderRadiusTop"
            :bottomRadius="data.borderRadiusBottom"
            @click="sheep.$router.go('/pages/goods/index', { id: item.id })"
        >
          <template v-slot:cart>
            <button class="ss-reset-button cart-btn" :style="[buyStyle]">
              {{ buyNowStyle.mode === 1 ? buyNowStyle.text : '' }}
            </button>
          </template>
        </s-goods-column>
      </view>
    </view>

    <!-- 2   双列瀑布流列表-->
    <view
        v-if="mode === 2 && state.goodsList.length"
        class="goods-md-wrap ss-flex ss-flex-wrap ss-col-top"
    >
      <view class="goods-list-box">
        <view
            class="left-list"
            :style="[{ paddingRight: data.space + 'rpx', marginBottom: data.space + 'px' }]"
            v-for="item in state.leftGoodsList"
            :key="item.id"
        >
          <s-goods-column
              class="goods-md-box"
              size="md"
              :goodsFields="goodsFields"
              :tagStyle="tagStyle"
              :data="item"
              :titleColor="goodsFields.title?.color"
              :subTitleColor="goodsFields.subtitle.color"
              :topRadius="data.borderRadiusTop"
              :bottomRadius="data.borderRadiusBottom"
              :titleWidth="330 - marginLeft - marginRight"
              @click="sheep.$router.go('/pages/goods/index', { id: item.id })"
              @getHeight="mountMasonry($event, 'left')"
          >
            <template v-slot:cart>
              <button class="ss-reset-button cart-btn" :style="[buyStyle]">
                {{ buyNowStyle.mode === 1 ? buyNowStyle.text : '' }}
              </button>
            </template>
          </s-goods-column>
        </view>
      </view>
      <view class="goods-list-box">
        <view
            class="right-list"
            :style="[{ paddingLeft: data.space + 'rpx', marginBottom: data.space + 'px' }]"
            v-for="item in state.rightGoodsList"
            :key="item.id"
        >
          <s-goods-column
              class="goods-md-box"
              size="md"
              :goodsFields="goodsFields"
              :tagStyle="tagStyle"
              :data="item"
              :titleColor="goodsFields.title?.color"
              :subTitleColor="goodsFields.subtitle.color"
              :topRadius="data.borderRadiusTop"
              :bottomRadius="data.borderRadiusBottom"
              :titleWidth="330 - marginLeft - marginRight"
              @click="sheep.$router.go('/pages/goods/index', { id: item.id })"
              @getHeight="mountMasonry($event, 'right')"
          >
            <template v-slot:cart>
              <button class="ss-reset-button cart-btn" :style="[buyStyle]">
                {{ buyNowStyle.mode === 1 ? buyNowStyle.text : '' }}
              </button>
            </template>
          </s-goods-column>
        </view>
      </view>
    </view>

    <!-- 3  30%卡片列表-->
    <view v-if="mode === 3 && state.goodsList.length" class="goods-lg-box">
      <view
          class="goods-box"
          :style="[{ marginBottom: data.space + 'px' }]"
          v-for="item in state.goodsList"
          :key="item.id"
      >
        <s-goods-column
            class="goods-card"
            size="lg"
            :goodsFields="goodsFields"
            :data="item"
            :tagStyle="tagStyle"
            :titleColor="goodsFields.title?.color"
            :subTitleColor="goodsFields.subtitle.color"
            :topRadius="data.borderRadiusTop"
            :bottomRadius="data.borderRadiusBottom"
            @tap="sheep.$router.go('/pages/goods/index', { id: item.id })"
        >
          <template v-slot:cart>
            <button class="ss-reset-button cart-btn" :style="[buyStyle]">
              {{ buyNowStyle.mode === 1 ? buyNowStyle.text : '' }}
            </button>
          </template>
        </s-goods-column>
      </view>
    </view>
    <uni-load-more
        v-if="state.pagination.total > 0"
        :status="state.loadStatus"
        :content-text="{
       contentdown: '上拉加载更多',
     }"
        @tap="loadmore"
    />
    <!--    <s-empty v-if="state.pagination.total === 0" icon="/static/soldout-empty.png" text="暂无商品" />-->
  </view>
</template>

<script setup>
/**
 * 商品模板，装修商品卡片
 * @description style 1:带tab 2：瀑布流，横向两个，上图下内容 3：大图，横向一个
 */
import { computed, reactive, onMounted } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import _ from "lodash";

const pagination = {
  data: [],
  page: 1,
  total: 0,
  size: 10
};

const state = reactive({
  pagination: {
    page: 1,
    total: 0,
    size: 10
  },
  loadStatus: "",
  goodsList: [],
  leftGoodsList: [],
  rightGoodsList: [],
});
const props = defineProps({
  data: {
    type: Object,
    default() {},
  },
  styles: {
    type: Object,
    default() {},
  },
});
async function loadmore() {
  if (state.loadStatus !== "noMore") {
    state.pagination.page++;
    await getList();
  }
}
const { mode, tagStyle, buyNowStyle, goodsFields, goodsIds } = props.data ?? {};
const { marginLeft, marginRight } = props.styles ?? {};

async function getGoodsListByIds(ids) {
  let { data } = await sheep.$api.goods.ids({ ids });
  return data;
}

async function getList() {
  state.loadStatus = 'loading'
  const params = {
    publishStatus: 1,
    ...props.data.params
  }
  const res = await sheep.$api.goods.list(params, { page: state.pagination.page - 1, size: state.pagination.size });
  const {content,totalElements, totalPages } = res;
  let goodsList = state.goodsList.concat(content);
  state.pagination.data = goodsList;
  state.pagination.total = totalElements;
  state.goodsList = goodsList;
  mountMasonry();
  if (state.pagination.page < totalPages){
    state.loadStatus = 'more'
  }else {
    state.loadStatus = 'noMore'
  }
  console.log('res', res)
}
// 上拉加载更多
onReachBottom(() => {
  loadmore();
});
onMounted(async () => {
  await getList()
  if (mode === 2) {
    mountMasonry();
  }
});

// 加载瀑布流
let count = 0;
let leftHeight = 0;
let rightHeight = 0;

function mountMasonry(height = 0, where = 'left') {
  if (!state.goodsList[count]) return;
  if (count %2 === 0) {
    state.leftGoodsList.push(state.goodsList[count]);
  } else {
    state.rightGoodsList.push(state.goodsList[count]);
  }
  // if (!state.goodsList[count]) return;
  // if (where === 'left') leftHeight += height;
  // if (where === 'right') rightHeight += height;
  // if (leftHeight <= rightHeight) {
  //   state.leftGoodsList.push(state.goodsList[count]);
  // } else {
  //   state.rightGoodsList.push(state.goodsList[count]);
  // }
  count++;
}

// 购买按钮样式
const buyStyle = computed(() => {
  if (buyNowStyle.mode == 1) {
    // button
    return {
      background: `linear-gradient(to right, ${buyNowStyle.color1}, ${buyNowStyle.color2})`,
    };
  }

  if (buyNowStyle.mode == 2) {
    // image
    return {
      width: '54rpx',
      height: '54rpx',
      background: `url(${sheep.$url.cdn(buyNowStyle.src)}) no-repeat`,
      backgroundSize: '100% 100%',
    };
  }
});
</script>

<style lang="scss" scoped>
.goods-md-wrap {
  width: 100%;
}

.goods-list-box {
  width: 50%;
  box-sizing: border-box;
  .left-list {
    &:nth-last-child(1) {
      margin-bottom: 0 !important;
    }
  }
  .right-list {
    &:nth-last-child(1) {
      margin-bottom: 0 !important;
    }
  }
}

.goods-box {
  &:nth-last-of-type(1) {
    margin-bottom: 0 !important;
  }
}

.goods-md-box,
.goods-sl-box,
.goods-lg-box {
  position: relative;

  .cart-btn {
    position: absolute;
    bottom: 18rpx;
    right: 20rpx;
    z-index: 11;
    height: 50rpx;
    line-height: 50rpx;
    padding: 0 20rpx;
    border-radius: 25rpx;
    font-size: 24rpx;
    color: #fff;
  }
}
</style>
