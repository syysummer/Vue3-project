<script setup lang="ts">
import { ref } from 'vue'
import Tree from './tree.vue'
const dataTree = ref([
  {
    name: '1',
    id: 1,
    checked: false,
    children: [
      {
        name: '1-1',
        id: 11,
        checked: true,
      }
    ]
  },
  {
    name: '2',
    id: 2,
    checked: false,
    children: [
      {
        name: '2-1',
        id: 21,
        checked: false,
      },
      {
        name: '2-2',
        id: 22,
        checked: false,
      }
    ]
  },
  {
    name: '3',
    id: 3,
    checked: false,
    children: [
      {
        name: '3-1',
        id: 31,
        checked: false,
      },
      {
        name: '3-2',
        id: 32,
        checked: false,
      }
    ]
  }
])

const changeChecked = (list: any[], id: number) => {
  list.forEach((item) => {
    if (item.id  === id) {
      item.checked = !item.checked
    }
    if (item.children?.length) {
      changeChecked(item.children, id)
    }
  })
}

const handleCheck = (obj: any) => {
  changeChecked(dataTree.value, obj.id)
}
</script>

<template>
  <Tree :dataTree="dataTree" @handleCheck="handleCheck"></Tree>
</template>

<style lang="scss" scoped>
</style>
