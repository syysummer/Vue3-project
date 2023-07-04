<script setup lang="ts">
</script>

<template>
  <div class="suspence-default">
    <div class="avatar">
      <img src="" alt="">
    </div>
    <div class="user-info">
      <div class="user-name"></div>
      <div class="user-work"></div>
      <div class="user-brief"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.suspence-default {
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
    background: #EAEAEA;
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
      background: #EAEAEA;
    }
  }
}
</style>
