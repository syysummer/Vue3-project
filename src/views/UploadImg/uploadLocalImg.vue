<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue"
const props = defineProps(["uploadProps"])
</script>

<template>
  <el-upload
    class="upload-demo"
    drag
    :action="props.uploadProps.action"
    :multiple="props.uploadProps.multiple"
    @change="props.uploadProps.onChange"
    :on-progress="props.uploadProps.onProgress"
    :on-success="props.uploadProps.onSuccess"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖拽文件至此区域 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">支持单次或批量上传</div>
    </template>
  </el-upload>
</template>
