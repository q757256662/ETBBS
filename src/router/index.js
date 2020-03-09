import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   hidden: true,
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index')
  //   }]
  // },
  {
    path: '/dashboard',
    component: Layout,
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: '/',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/addTag',
    component: Layout,
    name: 'addTag',
    hidden: true,
    children: [{
      path: '/addTag',
      component: () => import('@/views/dashboard/addTag.vue')
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/mytask',
    name: 'mytask',
    hidden: true,
    children: [{
      path: 'mytask',
      name: 'mytask',
      component: () => import('@/views/mytask/index'),
      meta: { title: '我的话题', icon: 'topic',role:[1,0] }
    }]
  },
  {
    path: '/mytask',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'mytask',
        component: () => import('@/views/mytask/index'),
        meta: { title: '我的话题', icon: 'topic',role:[1,0] }
      }
    ],
    hidden: false,

  },
  {
    path: '/submitTopic',
    component: Layout,
    hidden:true ,
    children: [
      {
        path: 'index',
        name: 'submitTopic',
        // component: () => import('@/views/table/index.vue'),
        component: () => import('@/views/table/ImproveTopic.vue'),
        meta: { title: '发帖子', icon: 'form',role:[1,0]},
      }
    ]
  },
  {
    path: '/standardSubmit',
    component: Layout,
    hidden:true ,
    children: [
      {
        path: 'index',
        name: 'standardSubmit',
        component: () => import('@/views/table/index.vue'),
        // component: () => import('@/views/table/ImproveTopic.vue'),
        meta: { title: '发帖子', icon: 'form',role:[1,0]},
      }
    ]
  },
  // {
  //   path: '/oldtopic',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'oldtopic',
  //       component: () => import('@/views/oldtopic/index'),
  //       meta: { title: '旧话题', icon: 'topic' }
  //     }
  //   ],
  //   hidden: true,
  // },
  {
    path: '/MyCollections',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'MyCollections',
        component: () => import('@/views/collections/index'),
        meta: { title: '我的收藏', icon: 'collection',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/TopicList',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TopicList',
        component: () => import('@/views/topicList/index'),
        meta: { title: '话题查询', icon: 'query',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/FunctionTopic',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'FunctionTopic',
        component: () => import('@/views/topicPower/index'),
        meta: { title: '功能目录', icon: 'function',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'statistics',
        component: () => import('@/views/topicCount/index'),
        meta: { title: '统计信息', icon: 'static',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/PublicTopic',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'PublicTopic',
        component: () => import('@/views/publickTopic/index1'),
        meta: { title: '本公司公告', icon: 'notice',dot:'123',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/Delevopment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Delevopment',
        component: () => import('@/views/personinfo/index'),
        meta: { title: '开发部公告', icon: 'notice',dot:'321',role:[1] }
      }
    ],
    hidden: false,
  },
  {
    path: '/newTopic',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'newTopic',
        component: () => import('@/views/publickTopic/newTopic'),
        meta: { title: '新公告', icon: 'notice',dot:'321',role:[1] }
      }
    ],
    hidden: true,
  },
  {
    path: '/TopicSingle',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'TopicSingle',
        component: () => import('@/views/TopicSingle'),
        meta: { title: '帖子', icon: 'form' }
      }
    ],
    hidden:true
  },
  {
    // path:"/systemManager",
    path: '/systemManager',
    component: Layout,
    children:[
      {
        path:"/",
        name:"systemManager",
        component:()=> import('@/views/systemManager/index'),
        meta: { title: '系统管理', icon: 'setting',role:[1] }
      }
    ],
    hidden: true,
    // hidden:true
  },
  {
    // path:"/systemManager",
    path: '/mynotice',
    component: Layout,
    children:[
      {
        path:"/",
        name:"mynotice",
        component:()=> import('@/views/publickTopic/myNotice.vue'),
        meta: { title: '我的公告', icon: 'notice',role:[1] }

      }
    ],
    hidden:true
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

