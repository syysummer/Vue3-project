<script lang="ts" setup>
import { reactive, ref } from "vue"
import TestDrive from './testDrive.vue'
import TestDriveRate from './testDriveRate.vue'
</script>

<template>
   <!-- 图表展示区域 -->
   <div class="charts-wrap">
      <!-- 试驾邀约 -->
      <div class="chart-item"><TestDrive /></div>
      <!-- 试驾邀约率 -->
      <div class="chart-item"><TestDriveRate /></div>
      <!-- 试驾成功邀约 -->
      <div class="chart-item"></div>
      <!-- 试驾邀约成功率 -->
      <div class="chart-item"></div>
    </div>
</template>

<style lang="scss" scoped>
.charts-wrap{
  width: 100%;
  display: flex;
  justify-self: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 25px;
  .chart-item{
    box-sizing: border-box;
    margin-bottom: 20px;
    width: 50%;
    height: 400px;
    border: 1px solid #EFEFEF;
  }
}
</style>
