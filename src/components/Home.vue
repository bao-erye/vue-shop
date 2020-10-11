<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout()">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="stoggleCollapse" @click="stoggleCollapse">|||</div>
                <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff"
                :unique-opened="true"
                :collapse-transition="false"
                :collapse="isCollapse"
                :router="true"
                :default-active="activiePath">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="setActivePath('/' + subItem.path)">
                                <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            menuList: [],
            iconsObj: {
                125: 'iconfont icon-users',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpingouwudai2',
                102: 'iconfont icon-danju-tianchong',
                145: 'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse: false,
            // 当前连接地址
            activiePath: ''
        }
    },
    created () {
        this.getMenuList()
        // 从存储中获取链接地址
        this.activiePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout () {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取菜单列表
        async getMenuList () {
            const { data: res } = await this.$http.get('menus')
            console.log(res.data)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        // 点击折叠菜单
        stoggleCollapse () {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        setActivePath (activiePath) {
            window.sessionStorage.setItem('activePath', activiePath)
            this.activiePath = activiePath
        }
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #3d3741;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
        display: flex;
        align-items: center;
        color: #ffffff;
        > img {
            width: 40px;
            height: 40px;
        }
    }
}
.el-aside{
    background-color:#333744;
    .el-menu{
        border: none;
        .el-submenu{
            span{
                margin-left: 10px;
            }
        }
    }
}
.stoggleCollapse{
    background-color: #333744;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    color: #ffffff;
    letter-spacing: 0.1em;
    cursor: pointer;
}
.el-main{
    background-color: azure;
}
</style>
