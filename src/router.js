import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'
import PrairieDogIndex from './views/prairiedog/PrairieDogIndex.vue'
import PrairieDogMobileIndex from './views/prairiedog/PrairieDogMobileIndex.vue'
import PrairieDogPlayRoom from './views/prairiedog/PrairieDogPlayRoom.vue'
import PrairieDogMobilePlayRoom from './views/prairiedog/PrairieDogMobilePlayRoom.vue'
import PrairieDogRules from './views/prairiedog/PrairieDogRules.vue'
import AnyamonyaIndex from './views/anyamonya/AnyamonyaIndex.vue'
import AnyamonyaPlayRoom from './views/anyamonya/AnyamonyaPlayRoom.vue'
import AnyamonyaRules from './views/anyamonya/AnyamonyaRules.vue'
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
      path: '/prairie-dog-mobile',
      name: 'prairiedogmobile',
      component: PrairieDogMobileIndex
    },
    {
      path: '/playroom/:roomId',
      name: 'prairiedogplayroom',
      component: PrairieDogPlayRoom
    },
    {
      path: '/mobileplayroom/:roomId',
      name: 'prairiedogmobileplayroom',
      component: PrairieDogMobilePlayRoom
    },
    {
      path: '/prairie-dog/rules',
      name: 'prairiedogrules',
      component: PrairieDogRules
    },
    {
      path: '/anya-monya',
      name: 'anyamonya',
      component: AnyamonyaIndex
    },
    {
      path: '/anyamonyaplayroom/:roomId',
      name: 'anyamonyaplayroom',
      component: AnyamonyaPlayRoom
    },
    {
      path: '/anya-monya/rules',
      name: 'anyamonyarules',
      component: AnyamonyaRules
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
