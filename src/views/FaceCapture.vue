<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { onMounted, ref, reactive, toRefs } from 'vue'

const inputRef = ref<any>(null)

const data = reactive({
  imgUrl: '',
  similarity: 0,           // 相似度
  detectList: {},          // 检测项
  optionList: {},          // 辅助项
  showSimilar: false,      // 人脸相似度比较
  trackVideoFaces: false,  // 视频人脸追踪
  trackCameraFaces: false, // 摄像头人脸追踪
  videoStream: '',         // 摄像头视频流
  videoStatus: 0,          // 0：暂停，1：播放
  genderTranslator: {
    male:   '男',
    female: '女'
  },
  expressionTranslator: {
    neutral:   '正常',
    happy:     '开心',
    sad:       '伤心',
    angry:     '生气',
    fearful:   '害怕',
    disgusted: '恶心',
    surprised: '惊喜',
  },
  // 检测类型
  detectTypes: [
    'AgeAndGender', //  年龄性别
    'Expression',   //  表情
    'Face',         //  人脸
  ],
  faces: [], // 录入的人脸描述

  showConfig: false, // 人脸检测器配置弹出层
  columns: [
    {
      values: [
        { text: 'SSD', value: 'SSD' },
        { text: 'Tiny', value: 'Tiny' }
      ],
      defaultIndex: 1
    },
    {
      values: [
        { text: '0.1', value: 0.1 },
        { text: '0.2', value: 0.2 },
        { text: '0.3', value: 0.3 },
        { text: '0.4', value: 0.4 },
        { text: '0.5', value: 0.5 },
        { text: '0.6', value: 0.6 },
        { text: '0.7', value: 0.7 },
        { text: '0.8', value: 0.8 },
        { text: '0.9', value: 0.9 },
      ],
      defaultIndex: 4
    },
    {
      values: [
        { text: '128', value: 128 },
        { text: '160', value: 160 },
        { text: '224', value: 224 },
        { text: '320', value: 320 },
        { text: '416', value: 416 },
        { text: '512', value: 512 },
        { text: '608', value: 608 }
      ],
      defaultIndex: 3
    }
  ],
  selectedValue: ['Tiny', 0.5, 320],

  showCameraList: false, // 摄像头列表弹出层
  cameraList: [],
  videoTrack: null,

  count: 0,
  forwardTimes: [],
  time: '',
  fps: ''
})

const refs = reactive({
  canvas: null,
  img: null,
  video: null,
  pickImage: null,
});
const { canvas, img, video, pickImage } = toRefs(refs)

const onHandleChange = (e) => {
  e.stopPropagation()
  var fileData = e.target.files[0];
  if (!fileData) return;
  setTimeout(() => data.imgUrl = window.URL.createObjectURL(fileData), 300)
}

const init = () => {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.mtcnn.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
    // faceapi.nets.tinyYolov.loadFromUri('./models')
  ])
  .then(() => {
    // entryFaces()
    console.log('模型加载完成')
  })
  .catch(() => {
    console.log('模型加载失败')
  })
}

const detectFactory = async () => {
  const { detectList, optionList, faces, imgUrl, trackVideoFaces, trackCameraFaces, videoStatus } = data;
  const input = trackVideoFaces || trackCameraFaces ? 'myVideo' : 'myImg'
  const ts = Date.now();

  if ((input === 'myImg' && !imgUrl) || (input === 'myVideo' && !videoStatus)) {
    return;
  }

  let displaySize;

  if (input === 'myImg') {
    displaySize = {
      width: img.value.width,
      height: img.value.height
    }
  } else {
    displaySize = {
      width: video.value.offsetWidth,
      height: video.value.offsetHeight
    }
  }
  // 准备画布，没有这一步方框位置会偏移
  faceapi.matchDimensions(canvas.value, displaySize);

  const options = getFaceDetectorOptions();

  // 绘制人脸识别结果
  if (detectList['Recognition']) {
    const detections = await faceapi
        .detectAllFaces(input, options)
        .withFaceLandmarks()
        .withFaceDescriptors()
    ;

    // 调整检测到的盒子和地标的大小，以防显示的图像与原始图像大小不同
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // 脸部比对的参考对象
    const faceMatcher = new faceapi.FaceMatcher(faces || []);

    resizedDetections.forEach(fd => {
      const { descriptor, detection: { box } } = fd;

      const bestMatch = faceMatcher.findBestMatch(descriptor)

      // 自定义输出边界盒子
      drawLabelBox(box, {
        label: bestMatch._label
      })
    })
  }

  // 绘制脸部表情
  if (detectList['Expression']) {
    const detections = await faceapi
        .detectAllFaces(input, options)
        .withFaceLandmarks()
        .withFaceExpressions();

    // 调整检测到的盒子和地标的大小，以防显示的图像与原始图像大小不同
    const resizedResults = faceapi.resizeResults(detections, displaySize);


    // 绘制文本框，显示最大可能性的表情
    // const minProbability = 0.05;
    // faceapi.draw.drawFaceExpressions(canvas.value, resizedResults, minProbability);


    // 自定义输出表情识别结果
    resizedResults.forEach(result => {
      const { expressions } = result;

      const maxProbability  = Math.max(...Object.values(expressions));
      const expression = Object.entries(expressions).find(([, value]) => value === maxProbability)[0];

      drawTexts(
          [
            `${data.expressionTranslator[expression]} (${Math.round(faceapi.utils.round(maxProbability) * 100)}%)`,
          ],
          result.detection.box.bottomLeft
      )
    })
  }

  // 绘制性别年龄
  if (detectList['AgeAndGender']) {
    const detections = await faceapi
        .detectAllFaces(input, options)
        .withFaceLandmarks()
        .withAgeAndGender();

    // 调整检测到的盒子和地标的大小，以防显示的图像与原始图像大小不同
    const resizedResults = faceapi.resizeResults(detections, displaySize);

    // 输出年龄、性别、年龄可能性
    resizedResults.forEach(result => {
      const { age, gender, genderProbability } = result;

      drawTexts(
          [
            `${data.genderTranslator[gender]} (${faceapi.utils.round(genderProbability) * 100}%)`,
            `${faceapi.utils.round(age, 0)} 岁 `
          ],
          result.detection.box.bottomLeft
      )
    })
  }

  // 绘制脸部边界
  if (optionList['showBorder']) {
    const detections = await faceapi
        .detectAllFaces(input, options);

    // 调整检测到的盒子和地标的大小，以防显示的图像与原始图像大小不同
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // 绘制方框
    // faceapi.draw.drawDetections(canvas.value, resizedDetections);

    // 自定义输出边界盒子
    resizedDetections.forEach(result => {
      const { box, _score } = result;

      drawLabelBox(box, {
        label: `可信度${Math.round(_score * 100)}%`
      })
    })
  }

  // 绘制脸部标记点
  if (optionList['showMark']) {
    const detections = await faceapi
        .detectAllFaces(input, options)
        .withFaceLandmarks()

    // 调整检测到的盒子和地标的大小，以防显示的图像与原始图像大小不同
    const resizedResults = faceapi.resizeResults(detections, displaySize);

    // 将标记点绘制到画布中
    faceapi.draw.drawFaceLandmarks(canvas.value, resizedResults);
  }

  if (videoStatus) {
    updateTimeStats(Date.now() - ts);

    setTimeout(() => {
      window.requestAnimationFrame(detectFactory);
    })
  }
}

// 配置人脸检测器参数
const getFaceDetectorOptions = () => {
  const { selectedValue } = data;

  return selectedValue[0] === 'SSD'
    ? new faceapi.SsdMobilenetv1Options({
      minConfidence: selectedValue[1]
    })
    /**
     * @param inputSize?: number
     处理图像的大小，越小越快
      在检测较小的人脸时， 必须被32整除
      常见的大小有128、160、224、320、416、512、608 ,
      用于通过网络摄像头进行人脸跟踪我建议使用较小尺寸的，例如128、160
      用于检测较小的人脸使用较大尺寸的，例如512、608
      默认值： 416
      *  @param scoreThreshold?: number
      最小置信阈值
      默认值:0.5
      *
      * @desc inputSize和scoreThreshold的不同配置，都会影响返回结果的数量
      * */
    : new faceapi.TinyFaceDetectorOptions({
      scoreThreshold: selectedValue[1],
      inputSize: selectedValue[2]
    })
}

/**
 * @desc 自定义文本描绘框
 *
 * @param {object}  box     - 盒子位置大小
 * @param {object}  options - 配置项
 * */
const drawLabelBox = (box, options) => {
  // 绘制框 + 绘制文本
  const _box = { x: 50, y: 50, width: 100, height: 100 }
  const drawOptions = {
    label: 'Hello I am a box!', // 框的描述文字，只能整单行文字
    lineWidth: 2,               // 边框宽度
    boxColor: 'red',            // 边框颜色，默认蓝色
    drawLabelOptions: {
      anchorPosition: 'TOP_LEFT',            // [TOP_LEFT | TOP_RIGHT | BOTTOM_LEFT | BOTTOM_RIGHT]
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // label文字块的背景颜色
      fontColor: 'purple',                   // label文字颜色
      fontSize:  16,                         // label文字大小
      padding: 15                            // label文字的padding
    }
  }
  const drawAreaBox = new faceapi.draw.DrawBox(box || _box, options || drawOptions);
  drawAreaBox.draw(canvas.value);
}

/**
 * @desc 自定义文本字段
 *
 * @param {array}  texts   - 多行文字
 * @param {object} pos     - 文本位置
 * @param {object} options - 配置项
 * */
const drawTexts = (texts, pos, options) => {
  // 绘制多行文本块
  const text = [
    'This is a textline!',
    'This is another textline!'
  ]
  const anchor = { x: 200, y: 200 };         // 相对于canvas的位置
  const drawOptions  = {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // 文字块的背景颜色
    // fontColor: 'purple',                   // 文字颜色
    // fontSize:  16,                         // 文字大小
    // padding: 15                            // 文字的padding
  }

  const drawTextBox = new faceapi.draw.DrawTextField(texts || text, pos || anchor, options || drawOptions)
  drawTextBox.draw(canvas.value)
}

// 计算平均花费时长和FPS
const updateTimeStats = (timeInMs) => {
  data.forwardTimes = [timeInMs].concat(data.forwardTimes).slice(0, 30);
  const avgTimeInMs = data.forwardTimes.reduce((total, t) => total + t) / data.forwardTimes.length;

  data.time = `${Math.round(avgTimeInMs)} ms`;
  data.fps = `${faceapi.utils.round(1000 / avgTimeInMs)}`
}

onMounted(async () => {
  init()
})

</script>

<template>
  <div class="face-capture">
    <div class="upload-content">
      <label className='my_btn'>
        上传图片
        <input type="file" hidden accept="image/*" @change="onHandleChange" />
      </label>
      <div class="media-data-box">
        <!-- 预览图片S -->
        <img 
          className="img-wrap" 
          v-show="!data.trackVideoFaces && !data.trackCameraFaces"
          :src="data.imgUrl"  
          ref="img"
          id="myImg"
          @load="detectFactory"
        />

        <video
          v-if="data.trackVideoFaces"
          ref="video"
          id="myVideo"
          muted
          playsinline
          preload
          loop
          @durationchange="video.play()"
          @play="data.videoStatus = 1"
          @pause="data.videoStatus = 0"
        >
          <source src="../media/bbt.mp4" type="video/mp4">
          抱歉，您的浏览器不支持嵌入式视频。
        </video>

        <video
          v-if="data.trackCameraFaces"
          ref="video"
          id="myVideo"
          autoplay
          muted
          playsinline
          @play="data.videoStatus = 1"
          @pause="data.videoStatus = 0"
        />

        <canvas ref="canvas" />
      </div>
    </div>

    <div class="operate-btn-box">
      <div class="check-item">
        <label for="showMark">显示人脸标记点</label>
        <el-switch id="showMark" v-model="data.optionList.showMark" @change="detectFactory"/>
      </div>

      <div class="check-item">
        <label for="showBorder">显示人脸边界</label>
        <el-switch id="showBorder" v-model="data.optionList.showBorder" @change="detectFactory"/>
      </div>

      <div class="check-item">
        <label for="Expression">表情</label>
        <el-switch id="Expression" v-model="data.detectList.Expression" @change="detectFactory"/>
      </div>

      <div class="check-item">
        <label for="AgeAndGender">年龄性别</label>
        <el-switch id="AgeAndGender" v-model="data.detectList.AgeAndGender" @change="detectFactory"/>
      </div>

      <div class="check-item">
        <label for="AgeAndGender">视频人脸追踪</label>
        <el-switch id="AgeAndGender" v-model="data.trackVideoFaces" :disabled="data.trackCameraFaces" @change="detectFactory"/>
      </div>

       <div class="check-item">
        <label for="AgeAndGender"> 摄像头人脸追踪</label>
        <el-switch id="AgeAndGender" v-model="data.trackCameraFaces" :disabled="data.trackVideoFaces" @change="detectFactory"/>
      </div>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
.face-capture{
  .upload-content{
    display: flex;
    flex-direction: column;
    .my_btn{
      width: 120px;
      height: 40px;
      border: 1px solid #eaeaea;
      border-radius: 2px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }
    .media-data-box{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      position: relative;
      width: 600px;
      .img-wrap{
        width: 100%;
      }
      video{
        width: 100%;
      }
      canvas{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }

  .operate-btn-box{
    label{
      margin-right: 20px;
    }
  }
}
</style>
