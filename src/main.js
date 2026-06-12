import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// 앱에 피니아(중앙 금고)와 라우터를 연결합니다.
app.use(createPinia());
app.use(router);

app.mount('#app');