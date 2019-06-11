import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'
import PrairieDogIndex from './views/prairiedog/PrairieDogIndex.vue'
import PrairieDogPlayRoom from './views/prairiedog/PrairieDogPlayRoom.vue'
import PrairieDogRules from './views/prairiedog/PrairieDogRules.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/prairie-dog',
      name: 'prairiedog',
      component: PrairieDogIndex
    },
    {
      path: '/playroom/:roomId',
      name: 'prairiedogplayroom',
      component: PrairieDogPlayRoom
    },
    {
      path: '/prairie-dog/rules',
      name: 'prairiedogrules',
      component: PrairieDogRules
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
