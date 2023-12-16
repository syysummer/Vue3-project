<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from "vue"

const $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts

const myEChartsTestDrive = ref<any>()

// 堆叠柱状图
const barChartInit = () => {
  const myEChart = $echarts.init(myEChartsTestDrive.value)
  const option = {
    title: {
      text: '试驾邀约',
      left: '4%',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      show: true,
      top: 'bottom',
      data: ['邀约次数', '未邀约次数'],
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      data: ['时间1', '时间2', '时间3', '时间4', '时间5', '时间6'],
    },
    yAxis: [
      {
        type: 'value',
        name: '邀约次数',
      }
    ],
    series: [
      {
        name: '邀约次数',
        data: [10, 22, 28, 43, 49, 40],
        type: 'bar',
        stack: 'x',
        barWidth: 20,
        itemStyle:{
          normal:{
            color: 'rgba(0, 82, 217, 1)',
            borderColor:'#FFF',
            borderWidth: 1
          }
        }
      },
      {
        name: '未邀约次数',
        data: [5, 4, 3, 5, 10, 6],
        type: 'bar',
        stack: 'x',
        barWidth: 20,
        itemStyle:{
          normal:{
            color: 'rgba(2, 156, 212, 1)',
            borderColor:'#FFF',
            borderWidth: 1
          }
        },
      }
    ]
  };
  myEChart.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", () => {
    myEChart?.resize()
  })
}

onMounted(() => {
  barChartInit()
})
</script>

<template>
  <div class="test-drive-container">
    <div class="bar-echart" ref="myEChartsTestDrive"></div>
  </div>
</template>

<style lang="scss" scoped>
.test-drive-container {
  padding: 20px 0px;
  height: 100%;
  .bar-echart{
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
