<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加商品区域 -->
      <el-row>
        <el-col>
          <!-- 搜索区域 -->
          <el-input placeholder="请输入内容" style="width:350px;" :v-model="searchInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <!-- 添加商品按钮 -->
          <el-button type="primary" style="margin-left:15px;" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格区域 -->
      <el-table :data="goodsList" border stripe style="width: 100%" fit>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 搜索框输入绑定
      searchInput: '',
      // 商品总数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取所有商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods',
      { params: this.queryInfo })
      console.log(res.data)
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize变化事件
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getGoodsList()
    },
    // 监听pagenum变化事件
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodsList()
    },
    // 监听“添加商品”按钮点击事件
    addGood() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style></style>
