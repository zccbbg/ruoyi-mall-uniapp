<!-- 页面  -->
<template>
  <s-layout title="签到有礼">
    <view class="sign-wrap" v-if="state.rules.signStatus">
      <!-- 签到日历 -->
      <view class="content-box calendar">
        <!-- 切换年月 -->
        <view class="bar ss-flex ss-col-center ss-row-center">
          <view class="previous" @tap="handleCalendar(-1)"><text class="cicon-back"></text></view>
          <view class="date ss-m-x-20"
            >{{ state.cur_year || '--' }} 年 {{ state.cur_month || '--' }} 月</view
          >
          <view class="next" @tap="handleCalendar(1)"><text class="cicon-forward"></text></view>
        </view>

        <!-- 显示星期 -->
        <view class="week ss-flex">
          <view
            class="week-item ss-flex ss-row-center"
            v-for="(item, index) in state.weeks_ch"
            :key="index"
          >
            {{ item.title }}
          </view>
        </view>

        <!-- 日历表 -->
        <view class="myDateTable">
          <view
            v-for="(item, j) in state.data.days"
            :key="j"
            class="dateCell ss-flex ss-row-center ss-col-center"
          >
            <!-- 空格 -->
            <view class="ss-flex ss-row-center ss-col-center">
              <text :decode="true">&nbsp;&nbsp;</text>
            </view>
            <view>
              <!-- 已签到日期 -->
              <view v-if="item.is_sign" class="is-sign ss-flex ss-row-center">
                <view class="is-sign-num">{{ item.day < 10 ? '0' + item.day : item.day }}</view>
                <image
                  class="is-sign-image"
                  :src="sheep.$url.static('/static/img/shop/app/correct.png')"
                >
                </image>
              </view>
              <!-- 未签到日期 -->
              <view
                class="is-sign ss-flex ss-row-center"
                v-if="!item.is_sign && item.day"
              >
                <view class="cell-num">{{ item.day < 10 ? '0' + item.day : item.day }}</view>
              </view>
            </view>
          </view>

          <!-- 签到按钮 -->
          <view class="ss-flex ss-col-center ss-row-center sign-box ss-m-y-40">
            <button class="ss-reset-button sign-btn" v-if="state.isSign === 0" @tap="onSign"
              >签到</button
            >
            <button class="ss-reset-button already-btn" v-if="state.isSign === 1" disabled
              >已签到</button
            >
          </view>
        </view>
      </view>
      <view class="bg-white ss-m-t-16 ss-p-t-30 ss-p-b-60 ss-p-x-40">
        <view class="activity-title ss-m-b-30">签到说明</view>
        <view class="activity-des">
          每日签到固定 {{ state.rules.signCount }} 积分
        </view>
      </view>
    </view>
    <s-empty
      v-else
      icon="/static/data-empty.png"
      text="签到活动还未开始"
    />
    <su-popup :show="state.showModel" type="center" round="10" :isMaskClick="false">
      <view class="model-box ss-flex-col">
        <view class="ss-m-t-56 ss-flex-col ss-col-center">
          <text class="cicon-check-round"></text>
          <view class="score-title">{{ state.signin.score }}积分</view>
        </view>
        <view class="model-bg ss-flex-col ss-col-center ss-row-right">
          <view class="title ss-m-b-64">签到成功</view>
          <view class="ss-m-b-40">
            <button class="ss-reset-button confirm-btn" @tap="onConfirm">确认</button>
          </view>
        </view>
      </view>
    </su-popup>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { computed, reactive } from 'vue';
  import dayjs from "dayjs";

  const headerBg = sheep.$url.css('/static/img/shop/app/sign.png');

  const state = reactive({
    data: {
      days: [], //日历
    },
    rules: {signCount: 1,signStatus: 1},
    cur_year: 0, //当前选的年
    cur_month: 0, //当前选的月
    cur_day: 0, //当前选择的天
    weeks_ch: [
      {
        title: '日',
        value: '0',
      },
      {
        title: '一',
        value: '1',
      },
      {
        title: '二',
        value: '2',
      },
      {
        title: '三',
        value: '3',
      },
      {
        title: '四',
        value: '4',
      },
      {
        title: '五',
        value: '5',
      },
      {
        title: '六',
        value: '6',
      },
    ], //星期
    showModel: false, //签到弹框
    signin: {}, // 签到
    isSign: 0, //今天是否签到
    loading: true,
  });
  async function onSign() {
    const res = await sheep.$api.activity.signAdd({amount: state.rules.signCount});
    if (res) {
      state.showModel = true;
      state.signin = {score: state.rules.signCount};
    }
  }

  //签到确认刷新页面
  function onConfirm() {
    state.showModel = false;
    handleCalendar(0);
  }

  //初始化天数
  function initDays(day) {
    const today = dayjs(dayjs().format('YYYY-MM-DD'))
    let current = dayjs()
    if (day) {
      current = current.add(day, 'month')
    }
    const year = current.year()
    const month = current.month() + 1
    const days = current.daysInMonth()
    const list = []
    for (let i = 0; i < days; i++) {
      const date = year + '-' + (month > 9 ? month : '0'+ month) + '-'+(i > 8 ? i + 1 : '0'+ (i + 1))
      const now = dayjs(year + '-' + (month > 9 ? month : '0'+ month) + '-'+(i > 8 ? i + 1 : '0'+ (i + 1)))
      list.push({
        "is_sign": 0,
        date,
        time: now.millisecond() / 1000,
        day: i+1,
        week: now.day(),
        current: now.isBefore(today)? 'before' : (now.isAfter(today) ? 'after':'today'),
      })
    }
    state.data.days = list
  }

  async function getData(month) {
    const res = await sheep.$api.activity.signList({month});
    const signList = []
    res.forEach(it=>{
      signList.push(dayjs(it.createTime).date())
    })

    if (state.data) {
      state.data.days.forEach((i, index) => {
        i.is_sign = signList.includes(i.day) ? 1 : 0
        if (index < i.week) {
          index++;
          let obj = {
            day: null,
            is_sign: false,
          };
          state.data.days.unshift(obj);
        }
        if (index === 1) {
          let arr = i.date.split('-');
          state.cur_year = arr[0];
          state.cur_month = arr[1];
        }
      });
      if (state.data.days[0].day == null) {
        state.data.days.forEach((i, index) => {
          if (i.current === 'today') {
            state.isSign = i.is_sign;
          }
        });
      }
    }
  }

  onReady(async () => {
    await getSignRule()
    initDays(0)
    getData(0);
  });

  async function getSignRule(){
    const res = await sheep.$api.data.getSysConfig({configKey:'activity-integral-income-set-key'});
    state.rules = res.data ? JSON.parse(res.data) : {signCount: 1,signStatus: 1}
  }

  // 切换控制年月，上一个月，下一个月
  const handleCalendar = (minus) => {
    const cur_year = parseInt(state.cur_year), cur_month = parseInt(state.cur_month);
    let newMonth, newYear = cur_year;
    newMonth = cur_month + minus;
    if (newMonth < 1) {
      newYear = cur_year - 1;
      newMonth = 12;
    } else if (newMonth < 10) {
      newMonth = '0' + newMonth;
    }
    if (newMonth > 12) {
      newYear = cur_year + 1;
      newMonth = 1;
    }
    const today = dayjs();
    const current = dayjs(newYear + '-' + newMonth + '-01')
    let monthsDiff = current.diff(today, 'months', true).toFixed();
    if (monthsDiff === '-0') {
      monthsDiff = 0
    }
    initDays(monthsDiff)
    getData(monthsDiff);
  };
</script>

<style lang="scss" scoped>
  .header-box {
    border-top: 2rpx solid rgba(#dfdfdf, 0.5);
  }

  // 日历
  .calendar {
    background: #fff;

    .sign-everyday {
      height: 100rpx;
      background: rgba(255, 255, 255, 1);
      border: 2rpx solid rgba(223, 223, 223, 0.4);

      .sign-everyday-title {
        font-size: 32rpx;
        color: rgba(51, 51, 51, 1);
        font-weight: 500;
      }

      .sign-num-box {
        font-size: 26rpx;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);

        .sign-num {
          font-size: 30rpx;
          font-weight: 600;
          color: #ff6000;
          padding: 0 10rpx;
          font-family: OPPOSANS;
        }
      }
    }

    // 年月日
    .bar {
      height: 100rpx;

      .date {
        font-size: 30rpx;
        font-family: OPPOSANS;
        font-weight: 500;
        color: #333333;
        line-height: normal;
      }
    }

    .cicon-back {
      margin-top: 6rpx;
      font-size: 30rpx;
      color: #c4c4c4;
      line-height: normal;
    }

    .cicon-forward {
      margin-top: 6rpx;
      font-size: 30rpx;
      color: #c4c4c4;
      line-height: normal;
    }

    // 星期
    .week {
      .week-item {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        flex: 1;
      }
    }

    // 日历表
    .myDateTable {
      display: flex;
      flex-wrap: wrap;

      .dateCell {
        width: calc(750rpx / 7);
        height: 80rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }

  .is-sign {
    width: 48rpx;
    height: 48rpx;
    position: relative;

    .is-sign-num {
      font-size: 24rpx;
      font-family: OPPOSANS;
      font-weight: 500;
      line-height: normal;
    }

    .is-sign-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 48rpx;
      height: 48rpx;
    }
  }

  .cell-num {
    font-size: 24rpx;
    font-family: OPPOSANS;
    font-weight: 500;
    color: #333333;
    line-height: normal;
  }

  .cicon-title {
    position: absolute;
    right: -10rpx;
    top: -6rpx;
    font-size: 20rpx;
    color: red;
  }

  // 签到按钮
  .sign-box {
    height: 140rpx;
    width: 100%;

    .sign-btn {
      width: 710rpx;
      height: 80rpx;
      border-radius: 35rpx;
      font-size: 30rpx;
      font-weight: 500;
      box-shadow: 0 0.2em 0.5em rgba(#ff6000, 0.4);
      background: linear-gradient(90deg, #ff6000, #fe832a);
      color: #fff;
    }

    .already-btn {
      width: 710rpx;
      height: 80rpx;
      border-radius: 35rpx;
      font-size: 30rpx;
      font-weight: 500;
    }
  }

  .model-box {
    width: 520rpx;
    // height: 590rpx;
    background: linear-gradient(177deg, #ff6000 0%, #fe832a 100%);
    // background: linear-gradient(177deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
    border-radius: 10rpx;

    .cicon-check-round {
      font-size: 70rpx;
      color: #fff;
    }

    .score-title {
      font-size: 34rpx;
      font-family: OPPOSANS;
      font-weight: 500;
      color: #fcff00;
    }

    .model-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #ffffff;
    }

    .model-bg {
      width: 520rpx;
      height: 344rpx;
      background-size: 100% 100%;
      background-image: v-bind(headerBg);
      background-repeat: no-repeat;
      border-radius: 0 0 10rpx 10rpx;

      .title {
        font-size: 34rpx;
        font-weight: bold;
        // color: var(--ui-BG-Main);
        color: #ff6000;
      }

      .subtitle {
        font-size: 26rpx;
        font-weight: 500;
        color: #999999;
      }

      .cancel-btn {
        width: 220rpx;
        height: 70rpx;
        border: 2rpx solid #ff6000;
        border-radius: 35rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #ff6000;
        line-height: normal;
        margin-right: 10rpx;
      }

      .confirm-btn {
        width: 220rpx;
        height: 70rpx;
        background: linear-gradient(90deg, #ff6000, #fe832a);
        box-shadow: 0 0.2em 0.5em rgba(#ff6000, 0.4);
        border-radius: 35rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #ffffff;
        line-height: normal;
      }
    }
  }

  //签到说明
  .activity-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: normal;
  }

  .activity-des {
    font-size: 26rpx;
    font-weight: 500;
    color: #666666;
    line-height: 40rpx;
  }
</style>
