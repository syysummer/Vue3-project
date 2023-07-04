<script setup>
import { ref } from 'vue'
import $http from '../../http/index'
const {data : userData} = await $http.request({
  method: 'GET',
  url: '/data.json?date=' + new Date().getTime()
})
</script>

<template>
  <div class="suspence-async">
    <div class="avatar">
      <img src="/ledi.png" alt="">
    </div>
    <div class="user-info">
      <div class="user-name">{{userData.name}}</div>
      <div class="user-work">{{userData.work}}</div>
      <div class="user-brief">{{userData.brief}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.suspence-async {
  width: 400px;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  .avatar{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .user-info{
    width: calc(100% - 90px);
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    >div{
      height: 25px;
    }
  }
}
</style>
