<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        style="margin-top:15px;"
        :data="this.categoryList"
        :columns="columns"
        border
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen;"
            v-if="scope.row.cat_deleted === true"
          ></i>
          <i class="el-icon-error" style="color: red;" v-else></i>
        </template>
        <!-- 排序列 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operate">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
      <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      append-to-body
      @close="addCateDialogClosed('addCateFormRef')"
    >
      <!-- 内容主体区域 -->
      <div>
        <el-form :model="addCateForm" ref="addCateFormRef" label-width="70px">
          <!-- 分类名称 -->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <!-- 父类 -->
          <el-form-item label="父级分类">
            <!-- option用来指定数据源 -->
            <!-- props指定配置对象 -->
            <!-- model选中项绑定值 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表查询参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      categoryList: [],
      // 商品分类总数
      total: 0,
      // 树形表格列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列设置为模板列
          type: 'template',
          // 当前模板列使用模板的名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 将当前列设置为模板列
          type: 'template',
          // 当前模板列使用模板的名称
          template: 'sort'
        },
        {
          label: '操作',
          // 将当前列设置为模板列
          type: 'template',
          // 当前模板列使用模板的名称
          template: 'operate'
        }
      ],
      // 添加分类弹框显示与隐藏
      addCateDialogVisible: false,
      // 表单数据绑定
      addCateForm: {
        // 添加分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认添加的是1级分类
        cat_level: 0
      },
      // 父级分类列表
      parentCateList: [],
      // 选择器指定配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择器选中ID数组
      selectedKeys: []
      }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.categoryList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getCategoryList()
    },
    // 监听pagenum改变事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCategoryList()
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类列表失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 监听添加分类按钮点击事件
    addCategory() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 选择项变化监听事件
    parentCateChange (addCateFormRef) {
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      this.addCateForm.cat_level = this.selectedKeys.length
      console.log(this.addCateForm)
    },
    // 添加分类弹框关闭事件
    addCateDialogClosed (addCateFormRef) {
      this.$refs[addCateFormRef].resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    }
  }
}
</script>

<style>
.margintop {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
