import { defineStore } from 'pinia';
import cartApi from '@/sheep/api/cart';

const cart = defineStore({
  id: 'cart',
  state: () => ({
    list: [], // 购物车列表
    selectedIds: [], // 已选列表
    isAllSelected: false, //是否全选
    cartSelectedTotalPrice: '0.00', // 选中项总金额
  }),
  getters: {
    totalPriceSelected: (state) => {
      let price = 0;
      if (!state.selectedIds.length) return price.toFixed(2);
      state.list.forEach((item) => {
        price += state.selectedIds.includes(item.id)
          ? Number(item.price) * item.quantity
          : 0;
      });
      return price.toFixed(2);
    },
  },
  actions: {
    // 获取购物车列表
    async getList() {
      const list = await cartApi.list();
      list.forEach(it => {
        let str = "";
        const obj = JSON.parse(it.spData);
        Object.keys(obj).forEach(key => {
          str += key + "：" + obj[key] + " ";
        });
        it.spDataValue = str;
      });
      this.list = list;
    },
    // 添加购物车
    async add(goodsInfo) {
      const res = await cartApi.append({
        productId: goodsInfo.productId,
        skuId: goodsInfo.id,
        productName: goodsInfo.productName,
        pic: goodsInfo.pic,
        quantity: goodsInfo.buyNum,
        spData: goodsInfo.spData
      });
      if (res > 0) {
        this.getList();
      }
    },

    // 更新购物车
    async update(goodsInfo) {
      console.log('goodsInfo',goodsInfo)
      const res = await cartApi.update(goodsInfo);
      if (res > 0) {
        this.getList();
      }
    },

    // 移除购物车
    async delete(ids) {
      if (ids instanceof Array) {
        ids = ids.join(',');
      }
      const res = await cartApi.delete(ids);
      if (res > 0) {
        this.selectAll(false);
        this.getList();
      }
    },

    // 选择购物车商品
    selectSingle(goodsId) {
      if (!this.selectedIds.includes(goodsId)) {
        this.selectedIds.push(goodsId);
      } else {
        this.selectedIds.splice(this.selectedIds.indexOf(goodsId), 1);
      }
      this.isAllSelected = this.selectedIds.length === this.list.length;
    },

    // 全选
    selectAll(flag) {
      this.isAllSelected = flag;
      if (!flag) {
        this.selectedIds = [];
      } else {
        this.list.forEach((item) => {
          this.selectedIds.push(item.id);
        });
      }
    },

    // 清空购物车
    emptyList() {
      this.list = [];
      this.selectedIds = [];
      this.isAllSelected = false;
      this.cartSelectedTotalPrice = '0.00';
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart-store',
      },
    ],
  },
});

export default cart;
