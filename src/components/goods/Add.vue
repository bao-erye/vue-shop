<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单区域 -->
      <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px"  label-position="top">
        <!-- tags标签页区域 -->
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name" ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodForm.goods_price"  type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-input v-model="addGoodForm.goods_cat"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数表单区域 -->
            <el-form-item v-for="item in goodManyCateData" :key="item.sttr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_val">
                <el-checkbox :label="cb" border v-for="(cb, i) in item.attr_val" :key="i" >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性区域 -->
            <el-form-item v-for="item in goodOnlyCateData" :key="item.attr_id" :label="item.attr_name">
              <el-input></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片区域 -->
            <el-upload
              :action="uploadUrl"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :on-error="handleError">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- 图片预览弹框 -->
            <el-dialog
              title="图片预览"
              :visible.sync="previewDialogVisible"
              width="50%">
              <img :src="previewPath" alt="" class="previewImg">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addGoodForm.goods_introduce">
            </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" style="margin-top:20px;">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前步骤条索引
      activeIndex: '0',
      // form表单对象
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '手机',
        pics: [],
        goods_introduce: ''
      },
      // 表单验证规则
      addGoodFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      // 商品动态参数列表
      goodManyCateData: [
        {
          attr_id: 1,
          attr_name: '品牌',
          attr_val: ['华为', '苹果', '一加']
        },
        {
          attr_id: 2,
          attr_name: '颜色',
          attr_val: ['红色', '绿色', '蓝色']
        }
      ],
      // 商品静态属性
      goodOnlyCateData: [
        {
          attr_id: 1,
          attr_name: '商品全称'
        },
        {
          attr_id: 2,
          attr_name: '所属类别'
        },
        {
          attr_id: 3,
          attr_name: '所属系列'
        },
        {
          attr_id: 4,
          attr_name: '是否为促销产品'
        },
        {
          attr_id: 5,
          attr_name: '是否可折叠'
        }
      ],
      // 上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 为请求指定headers对象，可添加token验证
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览弹框显示与隐藏
      previewDialogVisible: false,
      // 预览图片地址
      previewPath: ''
    }
  },
  methods: {
    // 监听标签页改变事件
    beforeLeave(activeName, oldActiveName) {
      // console.log('改变之前的页面' + oldActiveName)
      // console.log('改变之后的页面' + activeName)
      if (this.addGoodForm.goods_cat === '') {
        this.$message.error('请输入商品分类')
        return false
      }
      // 如果是商品参数页面的话
      if (activeName === '1') {
      }
    },
    // 处理预览事件
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理图片移除事件
    handleRemove(file) {
      // 1.获取图片的临时路径
      const filePath = file.response.tmp_path
      // 2.从form对象中的pics中找到该图片路径的索引
      const i = this.addGoodForm.pics.findIndex(x => x.pic === filePath)
      // 3.根据索引移除图片路径
      this.addGoodForm.pics.splice(i, 1)
      console.log(this.addGoodForm)
    },
    // 处理上传成功事件
    handleSuccess(response) {
      console.log(response)
      this.$message.success('成功上传图片')
      if (response.meta.status !== 200) {
        this.$message.error('图片上传失败' + response.meta.msg)
      }
      this.addGoodForm.pics.push({ pic: response.data.tmp_path })
      console.log(this.addGoodForm)
    },
    // 处理上传失败事件
    handleError(err) {
      this.$message.error('图片上传失败' + err.meta.msg)
    }
  }
}
</script>

<style>
.previewImg{
  width: 100%;
}
.ql-editor{
  min-height: 300px;
}
</style>
