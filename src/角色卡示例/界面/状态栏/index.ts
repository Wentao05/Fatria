import App from './App.vue';
<<<<<<< HEAD
=======
import './global.css';
>>>>>>> a3304f5c537f59bab41e4904c632b679abfda9d6

$(async () => {
  await waitGlobalInitialized('Mvu');
  createApp(App).use(createPinia()).mount('#app');
});
