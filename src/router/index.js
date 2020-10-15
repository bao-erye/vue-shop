import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Category from '../components/goods/Category.vue'
import Param from '../components/goods/Param.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/', name: 'index', redirect: '/login' },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
    { path: '/welcome', name: 'welcome', component: Welcome },
    { path: '/users', name: 'users', component: Users },
    { path: '/rights', name: 'rigths', component: Rights },
    { path: '/roles', name: 'roles', component: Roles },
    { path: '/categories', name: 'categories', component: Category },
    { path: '/params', name: 'params', component: Param },
    { path: '/goods', name: 'goods', component: List },
    { path: '/goods/add', name: 'add', component: Add }]
  }
]

const router = new VueRouter({
  routes
})

export default router
