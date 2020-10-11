<template>
  <div>
    <!-- 面包屑视图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdBottom',i1 === 0 ? 'bdTop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdTop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="danger">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"
                    closable @close="deleteRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 设置权限弹框 -->
    <el-dialog
      title="设置权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!-- 树形空间 -->
      <el-tree :data="rightsList" :props="setRightProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="checkedArray"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      rolesList: [],
      // 设置权限弹框
      setRightDialogVisible: false,
      // 树形权限列表
      rightsList: [],
      setRightProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选择的结点数组
      checkedArray: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 删除权限
    deleteRight (role, rightId) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败')
        }
        role.children = res.data
        this.$message.success('成功删除权限')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      },
      // 递归获取角色下所有三级权限id
      getCheckedArray (node, array) {
        if (!node.children) {
          return array.push(node.id)
        }
        node.children.forEach(item => {
          this.getCheckedArray(item, array)
        })
      },
      // 设置权限弹框
      async setRightDialog (role) {
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
        this.$message.success('成功获取权限列表')
        // 获取默认选中结点
        this.getCheckedArray(role, this.checkedArray)
        this.setRightDialogVisible = true
      },
      // 监听分配权限弹窗关闭事件
      setRightDialogClosed () {
        this.checkedArray = []
      }
  }
}
</script>

<style>
  .el-tag{
    margin: 7px;
  }
  .bdTop{
    border-top: 1px solid #eee;
  }
  .bdBottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
