<script setup lang="ts">
import _ from 'lodash'
import { ref } from 'vue'
const listNative = Array.apply(null, {length: 81} as number[])
const list = ref(listNative.map((item, index) => index + 1))

const handleRandom = () => {
  list.value = _.shuffle(list.value)
}

</script>


<!-- 平面过渡 需要添加move-class属性并添加过渡效果 -->
<template>
  <div class="transition-btn" @click="handleRandom">开始过渡</div>
  <transition-group move-class="move" class="transition-wrap" tag="div">
    <div class="transition-item" :key="item" v-for="(item) in list">{{item}}</div>
  </transition-group>
</template>

<style lang="scss" scoped>
.transition-btn{
  margin: 30px 0px 0px 30px;
  border: 1px solid #EAEAEA;
  cursor: pointer;
  width: 100px;
  padding: 20px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.transition-wrap{
  margin: 30px;
  width: calc(30px * 10 + 10px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .transition-item{
    width: 30px;
    height: 30px;
    border: 1px solid #EAEAEA;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.move{
  transition: all 1s;
}
</style>
