<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择器区域 -->
      <el-row style="margin:15px 0">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            style="width:300px;"
            v-model="selectedKeys"
            :options="goodCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            popper-class="cascader"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="tagClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="isBtnDisable">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="isBtnDisable">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      goodCateList: [],
      // 选中分类ID
      selectedKeys: [],
      // 选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 标签页的选中项
      activeName: 'many'
    }
  },
  computed: {
    // 决定按钮是否禁用
    isBtnDisable() {
      if (this.selectedKeys.length > 0) {
        return false
      } else {
        return true
      }
    },
    cateID() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      console.log(res.data)
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败')
      }
      this.goodCateList = res.data
    },
    // 选择器分类变化监听事件
    async parentCateChange() {
      console.log(this.selectedKeys)
      if (this.selectedKeys !== 3) {
        this.selectedKeys = []
      }
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`,
      { params: { sel: this.activeName } })
      console.log(res)
    },
    // 标签页点击事件
    tagClick() {
      console.log(this.activeName)
    }
  }
}
</script>

<style></style>
