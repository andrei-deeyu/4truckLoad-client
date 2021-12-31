import Vue from 'vue'
import VueRouter from 'vue-router'
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter)

  /*
    Route level code-splitting
      generate a separate chunk (about.[hash].js) for every route
      which is lazy-loaded when the route is visited.
  */
const routes = [
  {
    path: '/',
    name: 'Home',
    /*
      Create a loader component - containing a dynamic component
      In the loader - conditionally lazy load the option component based on the authentication boolean
    */
    component: () => import(/* webpackChunkName: "landingpage" */ '../components/HomeLoader.vue'),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/company/:watch?',
    name: 'Company',
    component: () => import(/* webpackChunkName: "company" */ '../views/Company.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "login" */ '../views/Signup.vue')
  },
  {
    path: '/addfreight',
    name: 'AddFreight',
    component: () => import(/* webpackChunkName: "addfreight" */ '../views/AddFreight.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/marfa/:freightID',
    name: 'Freight',
    component: () => import(/* webpackChunkName: "marfa" */ '../views/Freight.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
