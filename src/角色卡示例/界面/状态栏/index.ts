import App from './App.vue';
<<<<<<< HEAD
=======
import './global.css';
>>>>>>> 6939e54f496efe6c9e3921f663a5fa29e6ff3ddc

$(async () => {
  await waitGlobalInitialized('Mvu');
  createApp(App).use(createPinia()).mount('#app');
});
