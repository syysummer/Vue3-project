<script setup lang="ts">
import { onMounted, reactive } from "vue"

const list: any[] = reactive([
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
  {
    height: 200,
    background: 'deeppink'
  },
  {
    height: 300,
    background: 'blue'
  },
  {
    height: 400,
    background: 'lightblue'
  },
  {
    height: 300,
    background: 'lightgreen'
  },
  {
    height: 200,
    background: 'green'
  },
  {
    height: 300,
    background: 'pink'
  },
  {
    height: 500,
    background: 'orange'
  },
  {
    height: 400,
    background: 'yellow'
  },
  {
    height: 400,
    background: 'gray'
  },
])

const waterList:any[] = reactive<any[]>([]) // 瀑布流列表
const heightList:number[] = [] // 记录高度最低点
let lastIndex:number = 0 //记录已经渲染的列表index

const init = () => {
  const width = 130
  const x = document.body.clientWidth
  const column = Math.floor(x / width)

  for(let i = lastIndex; i < list.length; i++) {
    if (i < column){
      list[i].left = i * width
      list[i].top = 0
      waterList.push(list[i])
      heightList.push(list[i].height)
    } else {
      let current = heightList[0]
      let index = 0
      heightList.forEach((h, i) => {
        if (current > h) {
          current = h
          index = i
        }
      })
      list[i].top = current + 20
      list[i].left = index * width
      heightList[index] = heightList[index] + list[i].height + 20
      waterList.push(list[i])
    }
  }
  lastIndex = list.length
}


onMounted(() => {
  init()
  let count = 0
  const interTimer = setInterval(() => {
    if (count > 5) {
      clearInterval(interTimer)
      return
    }
    count++
    list.push(...[{
        height: 200,
        background: 'deeppink'
      },
      {
        height: 300,
        background: 'blue'
      },
      {
        height: 400,
        background: 'lightblue'
      },
      {
        height: 300,
        background: 'lightgreen'
      },
      {
        height: 200,
        background: 'green'
      },
      {
        height: 300,
        background: 'pink'
      },
      {
        height: 500,
        background: 'orange'
      },
      {
        height: 400,
        background: 'yellow'
      },
      {
        height: 400,
        background: 'gray'
      },
      {
        height: 200,
        background: 'deeppink'
      },
      {
        height: 300,
        background: 'blue'
      },
      {
        height: 400,
        background: 'lightblue'
      },
      {
        height: 300,
        background: 'lightgreen'
      },
      {
        height: 200,
        background: 'green'
      },
      {
        height: 300,
        background: 'pink'
      },
      {
        height: 500,
        background: 'orange'
      },
      {
        height: 400,
        background: 'yellow'
      },
      {
        height: 400,
        background: 'gray'
      },
      {
        height: 200,
        background: 'deeppink'
      },
      {
        height: 300,
        background: 'blue'
      },
      {
        height: 400,
        background: 'lightblue'
      },
      {
        height: 300,
        background: 'lightgreen'
      },
      {
        height: 200,
        background: 'green'
      },
      {
        height: 300,
        background: 'pink'
      },
      {
        height: 500,
        background: 'orange'
      },
      {
        height: 400,
        background: 'yellow'
      },
      {
        height: 400,
        background: 'gray'
      },
      {
        height: 200,
        background: 'deeppink'
      },
      {
        height: 300,
        background: 'blue'
      },
      {
        height: 400,
        background: 'lightblue'
      },
      {
        height: 300,
        background: 'lightgreen'
      },
      {
        height: 200,
        background: 'green'
      },
      {
        height: 300,
        background: 'pink'
      },
      {
        height: 500,
        background: 'orange'
      },
      {
        height: 400,
        background: 'yellow'
      },
      {
        height: 400,
        background: 'gray'
      },
      {
        height: 200,
        background: 'deeppink'
      },
      {
        height: 300,
        background: 'blue'
      },
      {
        height: 400,
        background: 'lightblue'
      },
      {
        height: 300,
        background: 'lightgreen'
      },
      {
        height: 200,
        background: 'green'
      },
      {
        height: 300,
        background: 'pink'
      }])
    init()
  }, 5000)
})
</script>

<template>
  <div class="wraps">
    <div :style="{height:item.height + 'px', left: item.left + 'px', top: item.top + 'px', background: item.background}" v-for="(item, index) in waterList" :key="index" class="items"></div>
  </div>
</template>

<style lang="scss" scoped>
.wraps{
  position: relative;
  .items{
    position: absolute;
    width: 120px;
  }
}
</style>
