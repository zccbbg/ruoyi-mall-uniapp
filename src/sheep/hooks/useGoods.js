import { ref } from 'vue';
import dayjs from 'dayjs';
import $url from '@/sheep/url';

// 格式化销量
export function formatSales(type, num) {
  num = num + '';
  if (type === 'exact') {
    return '已售' + num;
  } else {
    if (num < 10) {
      return '销量≤10';
    } else {
      let a = Math.pow(10, num.length - 1);
      return '已售' + parseInt(num / a) * a + '+';
    }
  }
}

// 格式化兑换量
export function formatExchange(type, num) {
  num = num + '';
  if (type === 'exact') {
    return '已兑换' + num;
  } else {
    if (num < 10) {
      return '已兑换≤10';
    } else {
      let a = Math.pow(10, num.length - 1);
      return '已兑换' + parseInt(num / a) * a + '+';
    }
  }
}

// 格式化库存
export function formatStock(type, num) {
  num = num + '';
  if (type === 'exact') {
    return '库存' + num;
  } else {
    if (num < 10) {
      return '库存≤10';
    } else {
      let a = Math.pow(10, num.length - 1);
      return '库存 ' + parseInt(num / a) * a + '+';
    }
  }
}

// 格式化价格
export function formatPrice(e) {
  return e.length === 1 ? e[0] : e.join('~');
}

// 格式化商品轮播
export function formatGoodsSwiper(list) {
  let swiper = [];
  list.forEach((item, key) => {
    if (item.indexOf('.avi') !== -1 || item.indexOf('.mp4') !== -1) {
      swiper.push({
        src: $url.cdn(item),
        type: 'video',
      });
    } else {
      swiper.push({
        src: $url.cdn(item),
        type: 'image',
      });
    }
  });
  return swiper;
}

export function formatOrderColor(type) {
  if (
      type === 2 ||
      type === 1
  ) {
    return 'warning-color';
  } else if (
      type === 4 ||
      type === 5
  ) {
    return 'danger-color';
  } else if (type === 3) {
    return 'success-color';
  } else if (type === 0) {
    return 'info-color';
  }
}

// 计算相隔时间
export function useDurationTime(toTime, fromTime = '') {
  toTime = getDayjsTime(toTime);
  if (fromTime === '') {
    fromTime = dayjs();
  }
  let duration = ref(toTime - fromTime);
  if (duration.value > 0) {
    setTimeout(() => {
      if (duration.value > 0) {
        duration.value -= 1000;
      }
    }, 1000);
  }

  let durationTime = dayjs.duration(duration.value);
  return {
    h: (durationTime.months() * 30 * 24 + durationTime.days() * 24 + durationTime.hours())
      .toString()
      .padStart(2, '0'),
    m: durationTime.minutes().toString().padStart(2, '0'),
    s: durationTime.seconds().toString().padStart(2, '0'),
    ms: durationTime.$ms,
  };
}

function getDayjsTime(time) {
  time = time.toString();
  if (time.indexOf('-') > 0) {
    // 'date'
    return dayjs(time);
  }
  if (time.length > 10) {
    // 'timestamp'
    return dayjs(parseInt(time));
  }
  if (time.length === 10) {
    // 'unixtime'
    return dayjs.unix(parseInt(time));
  }
}

export function getOrderStatusName(status) {
  switch (status) {
    case 0:return '待付款';
    case 1: return '待发货';
    case 2: return '待收货'
    case 3: return '已完成'
    case 4: return '已取消'
    case 5: return '无效订单'
  }
}
export function getOrderAfterSaleStatusName(status) {
  //1：无售后或售后关闭，2：售后处理中，3：退款中，4： 退款成功 5-退款失败
  switch (status) {
    case 1:return '无售后或售后关闭';
    case 2: return '售后处理中';
    case 3: return '退款中'
    case 4: return '退款成功'
    case 5: return '退款失败'
  }
}
