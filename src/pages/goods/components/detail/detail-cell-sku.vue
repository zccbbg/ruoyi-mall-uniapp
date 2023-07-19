<template>
  <detail-cell v-if="skus.length > 0" label="选择" :value="value"></detail-cell>
</template>

<script setup>
  import { computed } from 'vue';

  import detailCell from './detail-cell.vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default() {
        return '';
      },
    },
    skus: {
      type: Array,
      default() {
        return [];
      },
    },
  });
  const value = computed(() => {
    let str = '';
    if (props.modelValue) {
      const obj = JSON.parse(props.modelValue);
      Object.keys(obj).forEach(key=>{
        str += key + "：" + obj[key] + ' ';
      })
    } else {
      str = '请选择商品规格';
    }
    return str;
  });
</script>
