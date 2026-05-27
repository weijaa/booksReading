import { createRouter, createWebHashHistory } from 'vue-router'
import BookList from '../pages/BookList.vue'
import BookDetail from '../pages/BookDetail.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: BookList },
    { path: '/book/:id', component: BookDetail },
  ],
})
