<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import UploadLocalImg from './uploadLocalImg.vue'
import UploadFloderImg from './uploadFloderImg.vue'

const openUpload = ref(false)
const showUploadModal = () => {
  openUpload.value = true
}
const uploadProps = ref({
  name: 'file',
  multiple: true,
  accept: 'image/*',
  action: `http://172.23.88.97:1999/api/pictures_upload_image`,
  onChange: (info: any) => {
    console.log(info, '文件上传啦=============')
    const { status } = info
    // if (status !== 'uploading') {
    //   console.log(info, info);
    // } else if (status === "success") {
    //   ElMessage.success(`${info} 上传成功`)
    // } else if (status === 'error') {
    //   ElMessage.error(`${info} 上传失败`)
    // }
  },
  onProgress: (progress: any) => {
    console.log(progress, '上传进度啦========')
  },
  onSuccess: (file: any) => {
    console.log(file, '成功啦-==============')
  }
})

// 文件夹上传显示
const showUploadFloder = ref(false)
const openFloderUpload = () => {
  showUploadFloder.value = true
}
</script>

<template>
  <el-button class="upload-img-container" @click="showUploadModal">上传图片</el-button>
  <el-button class="upload-img-container" @click="openFloderUpload">上传目录</el-button>
  <!-- 上传弹窗(本地上传) -->
  <el-dialog
    v-model="openUpload"
    :width="800"
    :footer="null"
    class="upload-img-wrap"
  >
    <UploadLocalImg v-if="openUpload" :uploadProps="uploadProps" />
  </el-dialog>

  <!-- 上传弹窗(上传文件夹) -->
  <el-dialog
    v-model="showUploadFloder"
    :width="800"
    :footer="null"
    class="upload-img-wrap"
  >
    <UploadFloderImg v-if="showUploadFloder" :uploadProps="uploadProps"/>
  </el-dialog>
</template>
