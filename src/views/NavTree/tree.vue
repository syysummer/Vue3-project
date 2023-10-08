<script setup lang="ts">
const props = defineProps(['dataTree'])
const emits = defineEmits(['handleCheck'])
const handleCheck = (item: any, index: number):void => {
  emits('handleCheck', Object.assign(item, {index: index}))
}
</script>

<template>
  <div class="nav-tree">
    <div class="tree-item" :key="index" v-for="(item, index) in props.dataTree">
      <div class="nav-item-wrap">
        <div class="check-item" :class="{actived: item.checked}" @click="handleCheck(item, index)"></div>
        <div class="nav-title">{{ item?.name }}</div>
      </div>

      <tree v-if="item.children?.length" :dataTree="item.children" @handleCheck="handleCheck"></tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-tree{
  .tree-item{
    padding: 10px;
    .nav-item-wrap{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .check-item{
        width: 20px;
        height: 20px;
        border: 1px solid #EAEAEA;
        margin-right: 10px;
        &.actived{
          background-color: darkturquoise;
        }
      }
    }
  }
}
</style>
