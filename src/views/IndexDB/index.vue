<script setup lang="ts">
import { ref } from 'vue'
/**
 * Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found. 说明找不到存储对象空间
 * Uncaught InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase': A version change transaction is running 更新数据库的事务在执行
 * Uncaught DOMException: Failed to execute 'createObjectStore' on 'IDBDatabase': The database is not running a version change transaction. 创建对象存储必须放在更新版本事务中
 * 数据库配置获取
 */

// 页面使用相关状态
const dataList = ref<any>([]) // 获取到的数据列表
const curMusicIndex = ref(0) // 当前游标
const preCurMusicIndex = ref(1) // 当前已获取数据的游标
const isDbConneted = ref(false) // 当前数据库是否已连接
const pageSize = ref(10) // 每页获取大小
const currentOperateObj = ref<any>({}) // 当前操作对象
const isEidtDialogVisible = ref(false) // 编辑弹窗显示隐藏
const isEdit = ref(false) // 默认是新增
const isFinished = ref(false) // 是否加载完成

/*数据库相关变量*/
let storeName = 'imgStore' // storeName 仓库名称
let db: any = null

/**
 * 打开数据库
 * @param {object} dbName 
 * @param {string} 
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
const openDB = (dbName = 'imgPreview', version = 1, storeName = 'imgStore') => {
  return new Promise((resolve, reject) => {
    let indexedDB = window.indexedDB
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version)
    // 数据库打开成功回调
    request.onsuccess = (event: any) => {
      db = event.target?.result // 数据库对象
      resolve({
        code: 0,
        data: null,
        msg: "数据库连接成功！"
      })
    }
    // 数据库打开失败的回调
    request.onerror = () => {
      reject({
        code: -1,
        data: null,
        msg: "数据库连接失败！"
      })
    }
    // 数据库有更新时候的回调
    request.onupgradeneeded = (event: any) => {
      // 数据库创建或升级的时候会触发
      db = event.target?.result // 数据库对象
      initDataBaseTab(storeName)
    }
  })
}

/**
 * 初始化数据库表及索引设置
 */
const initDataBaseTab = (table_name: string) => {
  let tableMap: any = {
    imgStore: {
      'primary': 'id', // 主键
      'other': ['src', 'name'] // 其他的字段
    }
  }
  let needCreateTable = tableMap[table_name]
  var isExistDataBaseTab = typeof needCreateTable !='undefined' ? true : false
  if(isExistDataBaseTab){
      // 创建一个数据库存储对象，并设置主键
      var objectStore = db.createObjectStore(storeName, {
          keyPath: 'id',
          autoIncrement: true
      })
      //主键
      objectStore.createIndex(needCreateTable.primary, needCreateTable.primary, {
        unique: true
      })
      //数据项
      // for(var other of needCreateTable.other){
      //   objectStore.createIndex(other, other)
      // }
  }
}

/**
 * 新增数据
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
const addData = (storeName: string, data: any) => {
  return new Promise((resolve, reject) => {
    let request = db
      .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
    for(var item of data){
      request.add(item)
    }
    request.onsuccess = (event: any) => {
      console.log('新增成功')
      resolve({
        code: 0,
        data: null,
        msg: '数据新增成功'
      })
    }

    request.onerror = (event: any) => {
      console.log('新增失败')
      reject({
        code: -1,
        data: null,
        msg: "数据新增失败!",
      })
    }

    /*新增不执行onsuccess回调*/
    setTimeout(() => {
      resolve({
        code: 0,
        data: null,
        msg: '数据新增成功'
      })
    }, 2000)
  })
}

/*插入数据*/
const insertData = (dataConfig: any) => {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .put(dataConfig)
    // 操作成功
    request.onsuccess = () => {
      resolve({
        code: 0,
        data: null,
        msg: '数据插入成功！'
      })
    }
    // 操作失败
    request.onerror = () => {
      reject({
        code: -1,
        data: null,
        msg: "数据插入失败!",
      })
    }
  })
}

/*获取数据*/
const getData = (storeName: string, curMusicIndex: any, pageSize: number, matches: any) => {
  let timer:any = null
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(storeName)
    let request = null //游标查询
    let count = 0
    let resultArray: any[] = []
    // 打开游标查询
    request = transaction.objectStore(storeName).openCursor()
    request.onsuccess = (event: any) => {
      var result = event.target.result
      if (!curMusicIndex) {
        // 没有游标时默认从第一条开始
        matches.value = result.value?.id
        curMusicIndex = result.value?.id
      }
      if (result) {//判断是否有下一项数据
        if(matches){//是否有查询条件
          if(result.value[matches.key] === matches.value){//判断条件
            resultArray.push(result.value)
            count++
          }
          if (0 < count && count < (pageSize + 1)) {
            count > 1 && resultArray.push(result.value)
            count++
            // 游标没有遍历完，继续
            result.continue()
          }
          if (!count) {
            // 游标没有遍历完，继续
            result.continue()
          }
          if (count === (pageSize + 1)) {
            preCurMusicIndex.value =  curMusicIndex
            resolve({
              code: 0,
              data: {
                list: resultArray,
                curMusicIndex: result.value?.id
              },
              msg: '数据获取成功！'
            })
          }
        } else{
          resultArray.push(result.value)
          count++
          // 游标没有遍历完，继续
          result.continue()
          clearTimeout(timer)
          timer = setTimeout(() => {
            resolve({
              code: 0,
              data: {
                list: resultArray,
                curMusicIndex,
              },
              msg: '数据获取成功！'
            })
          }, 300)
        }
      } else {
        resolve({
          code: 0,
          data: {
            list: resultArray,
            curMusicIndex,
          },
          msg: '数据获取成功！'
        })
      }
    }
    request.onerror = (event: any) => {
      reject({
        code: -1,
        data: null,
        msg: '数据获取失败！'
      })
    }
  })
}

/*删除数据*/
const deleteData = (key: number) => {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName) // 仓库对象
      .delete(key)
    // 操作成功
    request.onsuccess = (e: { target: { result: any } }) => {
      resolve({
        code: 0,
        data: null,
        msg: '数据删除成功！'
      })
    }
    // 操作失败
    request.onerror = function () {
      reject({
        code: -1,
        data: null,
        msg: '数据删除失败！'
      })
    }
  })
}

/*处理获取数据*/
const handleGetData = () => {
  if (isFinished.value) return
  // 这里默认有匹配条件
  let matches: any = {'key':'id','value':+curMusicIndex.value}
  getData(storeName, curMusicIndex.value, pageSize.value, matches).then((res: any) => {
    dataList.value.push(...res.data?.list)
    curMusicIndex.value = res.data?.curMusicIndex
    if (res.data?.list?.length < pageSize.value) {
      isFinished.value = true
    }
  })
}

/*处理连接数据库*/
const handleConnectDB = async () => {
  openDB().then(() => {
    isDbConneted.value = true
  })
}

/*处理创建默认数据*/
const handleCreateDefaultData = () => {
  const initData = []
  for (let i = 1; i <= 500; i++) {
    initData.push({
      id: i,
      src: 'http://hdhg.com/img/xxxx.png',
      name: 'xxxx.png',
    })
  }
  addData(storeName, initData).then(() => {
    // 新建之后获取最新数据
    curMusicIndex.value = 0
    dataList.value = []
    isFinished.value = false
    handleGetData()
  })
}

/*处理插入数据*/
const handleInsertData = () => {
  currentOperateObj.value = ({id: '', src: '', name: ''})
  isEdit.value = false
  isEidtDialogVisible.value = true
}

/*处理编辑数据*/
const handleMoifyData = (item: any) => {
  currentOperateObj.value = item
  isEdit.value = true
  isEidtDialogVisible.value = true
}

/*修改数据库数据*/
const reqModifyDbData = () => {
  if (!currentOperateObj.value?.id || !currentOperateObj.value?.src || !currentOperateObj.value?.name) return

  insertData({id: Number(currentOperateObj.value?.id), src: currentOperateObj.value?.src, name: currentOperateObj.value?.name}).then(() => {
    isEidtDialogVisible.value = false
    curMusicIndex.value = preCurMusicIndex.value
    handleGetData()
  })
}

/*处理删除数据*/
const handleDeleteData = (item: any) => {
  deleteData(item.id).then(() => {
    curMusicIndex.value = 0
    dataList.value = []
    isFinished.value = false
    handleGetData()
  })
}

</script>

<template>
  <div class="title">indexDB测试</div>
  <div class="btn-wrap">
    <el-button type="primary" @click="handleConnectDB" :disabled="isDbConneted">连接数据库</el-button>
    <el-button type="primary" @click="handleCreateDefaultData" :disabled="!isDbConneted">创建默认数据</el-button>
    <el-button type="primary" @click="handleGetData" :disabled="!isDbConneted">获取数据</el-button>
    <el-button type="primary" @click="handleInsertData" :disabled="!isDbConneted">新增单条数据</el-button>
  </div>

  <!-- 数据列表 -->
  <div class="content-list">
    <div class="content-item" v-for="(item, index) in dataList" :key="index">
      <div class="id">{{ item.id }}</div>
      <div class="src">{{ item.src }}</div>
      <div class="name">{{ item.name }}</div>
      <div class="operate">
        <el-button type="primary" @click="handleMoifyData(item)">编辑</el-button>
        <el-button type="primary" @click="handleDeleteData(item)">删除</el-button>
      </div>
    </div>
  </div>

  <!-- 新增编辑数据弹窗 -->
  <el-dialog 
    v-model="isEidtDialogVisible" 
    :title="isEdit ? '编辑数据' : '新增数据'" width="30%" 
    @closed="isEidtDialogVisible = false" 
    class="edit-dialog"
    draggable 
    :close-on-click-modal="false"
  >
    <div class="input-item">
      <div class="label">id:</div>
      <el-input :disabled="isEdit" v-model="currentOperateObj.id" clearable/>
    </div>

    <div class="input-item">
      <div class="label">src:</div>
      <el-input v-model="currentOperateObj.src" clearable/>
    </div>

    <div class="input-item">
      <div class="label">name:</div>
      <el-input v-model="currentOperateObj.name" clearable/>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isEidtDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reqModifyDbData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.btn-wrap{
  margin-top: 2vh;
}
.content-list{
  width: 100%;
  margin-top: 1vh;
  height: calc(100vh - 150px);
  overflow-y: auto;
  .content-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ddd;
    margin: 5px auto;
    >div{
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
    }
  }
}

.edit-dialog{
  .input-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    .label{
      width: 60px;
    }
  }
}
</style>
