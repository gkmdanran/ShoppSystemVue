import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/users'
import goods from '../components/goods'
import rights from '../components/rights'
import roles from '../components/roles'
import categories from '../components/categories'
import orders from '../components/orders'
import params from '../components/params'
import add from '../components/add'
import edit from '../components/edit'
import reports from '../components/reports'
Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect:'/welcome',
      children:[
        {
          path: '/welcome',
          name: 'welcome',
          component: welcome
        },
        {
          path: '/users',
          name: 'users',
          component: users
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/rights',
          name: 'rights',
          component: rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: roles
        },
        {
          path: '/categories',
          name: 'categories',
          component:  categories
        },
        {
          path: '/orders',
          name: 'orders',
          component: orders
        },
        {
          path: '/params',
          name: 'params',
          component: params
        },
        {
          path: '/goods/add',
          name: 'add',
          component: add
        },
        {
          path: '/goods/edit',
          name: 'edit',
          component: edit
        },
        {
          path: '/reports',
          name: 'reports',
          component: reports
        },
      ]
    },
   
  ],
  mode:"history"
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next()直接放行 next('/login)强制跳转到login
  if(to.path=="/login")return next();
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next("/login")
  next()
})



export default router