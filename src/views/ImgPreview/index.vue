<script lang="ts" setup>
import { computed, ref, nextTick } from "vue"

/*相册预览*/
const imgViewerRef = ref()
const currentPreviewIndex = ref(0)
const isImagePreview = ref(false)
const urlList = computed(() => {
  return tableData.value.map((item) => item.img_name)
})
const tableData = ref([
  {
    id: 1,
    img_name:  "https://img95.699pic.com/photo/60053/2211.jpg_wh300.jpg",
  },
  {
    id: 2,
    img_name:  'https://pic.netbian.com/uploads/allimg/180826/113958-1535254798fc1c.jpg',
  },
  {
    id: 3,
    img_name:  'https://img95.699pic.com/photo/60060/6479.jpg_wh300.jpg',
  },
  {
    id: 4,
    img_name:  'https://cdn.pixabay.com/photo/2015/03/03/05/54/cherry-blossoms-656965_640.jpg',
  }
])

// 开启图片预览
const handlePreview = (scope: any) => {
  currentPreviewIndex.value = scope.$index
  isImagePreview.value = true
  nextTick(() => {
    imgViewerRef.value.setActiveItem(currentPreviewIndex.value)
  })
}

// 关闭图片预览
const handleClosePreview = () => {
  isImagePreview.value = false
}

// 切换图片预览
const  handleSiwtchPreview = (index: any) => {
  currentPreviewIndex.value = index
}

</script>

<template>
  <div>
    <!-- 表格 触发预览 -->
    <el-table class="data-list-table" :data="tableData">
      <el-table-column prop="id" label="序号" align="center" />
      <el-table-column prop="img_name" label="图片预览" align="center">
        <template #default="scope">
          <img :src="scope.row.img_name" alt="" :style="{objectFit: 'cover', width: '100px', height: 'auto', cursor: 'pointer'}" @click="handlePreview(scope)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 预览图片 -->
    <div class="image-preview-model" v-if="isImagePreview">
      <div class="image-preview-index">{{ (currentPreviewIndex +  1) + ' / ' + urlList.length }}</div>
      <el-image-viewer
        v-if="isImagePreview"
        ref="imgViewerRef"
        :src="urlList[currentPreviewIndex]"
        :zoom-rate="1.2"
        :initial-index="0"
        :zIndex="3000"
        :url-list="urlList"
        @close="handleClosePreview"
        @switch="handleSiwtchPreview"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-preview-index{
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  z-index: 3001;
  width: 200px;
  height: 36px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: center;
  line-height: 36px;
}
</style>
