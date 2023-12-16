<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from "vue"

const $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts

const myEChartsTestDriveRate = ref<any>()

// 虚线折线图
const lineChartInit = () => {
  const myEChart = $echarts.init(myEChartsTestDriveRate.value)
  const option = {
    title: {
      text: '试驾邀约率',
      left: '4%',
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross'
      // }
      formatter:function(params)  
        {  
           var relVal = params[0].name;  
           for (var i = 0, l = params.length; i < l; i++) {  
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+"%";  
            }  
           return relVal;  
        }  
    },
    legend: {
      data: ['邀约率']
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: ['时间1', '时间2', '时间3', '时间4', '时间5', '时间6'],
    },
    yAxis: {
      type: 'value',
      name: '百分比',
      axisLabel: {
        formatter: '{value} %'
      }
    },
    series: [
      {
        name: '百分比',
        data: [36, 24, 45, 82, 40, 60],
        type: 'line',
        symbolSize: 0,
        lineStyle: {
          color: 'rgba(0, 82, 217, 1)',
          width: 2,
          type: 'dashed'
        },
      },
    ]
  }
  myEChart.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", () => {
    myEChart?.resize()
  })
}

onMounted(() => {
  lineChartInit()
})
</script>

<template>
  <div class="test-drive-container">
    <div class="line-echart" ref="myEChartsTestDriveRate"></div>
  </div>
</template>

<style lang="scss" scoped>
.test-drive-container {
  padding: 20px 0px;
  height: 100%;
  .line-echart{
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
