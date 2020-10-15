<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" style="width:350px;">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表表格区域 -->
      <el-table :data="ordersList" border stripe style="width: 100%" fit>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px">
        </el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="(scope.row.order_pay = '1')">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px" ></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="addressDialogVisible = true">编辑</el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-position"
              @click="progressDialogVisible = true">物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressDialogVisible"
        width="50%"
      >
        <el-form
          :model="editAddressForm"
          :rules="editAddressFormRules"
          ref="editAddressFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省市区/县" prop="address">
            <!-- option用来指定数据源 -->
            <!-- props指定配置对象 -->
            <!-- model选中项绑定值 -->
            <el-cascader
              style="width:100%;"
              v-model="editAddressForm.address"
              :options="cityData"
              :props="cascaderProps"
              clearable
              popper-class="addressCascader"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressDetail">
            <el-input v-model="editAddressForm.addressDetail"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 查看物流信息对话框 -->
      <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%">
        <!-- 时间线 -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in progressData"
            :key="index"
            :timestamp="activity.time"
            color="#0bbd87">
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
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
// 导入城市数据
import cityData from './city-data.js'

export default {
  data() {
    return {
      // 订单列表
      ordersList: [],
      // 获取订单参数对象
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 订单总数
      total: 0,
      cityData,
      // 修改地址对话框的显示与隐藏
      addressDialogVisible: false,
      progressDialogVisible: false,
      // 修改地址表单对象
      editAddressForm: {
        address: [],
        addressDetail: ''
      },
      // 表单验证规则
      editAddressFormRules: {},
      // 选择器选中的值
      selectedKeys: [],
      // 选择器参数对象
      cascaderProps: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      // 物流信息数组
      progressData: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        }

      ]
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        this.$message.error('获取订单列表失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getOrdersList()
    },
    // 监听pagenum改变事件
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrdersList()
    }
  }
}
</script>

<style>
.addressCascader {
  height: 200px;
  overflow-y: scroll;
}
</style>
