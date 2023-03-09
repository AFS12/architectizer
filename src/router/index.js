import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import LayoutDefault from '../views/layouts/Default'
import Home from '../views/home/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: '',
    component: LayoutDefault,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
