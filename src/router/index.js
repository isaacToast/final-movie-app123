import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MoviesView.vue'),
    },
    {
      path: '/movies/:id',
      name: 'movie-detail',
      component: MovieDetailView,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ],
});

export default router;