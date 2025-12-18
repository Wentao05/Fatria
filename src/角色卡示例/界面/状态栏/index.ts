import App from './App.vue';
<<<<<<< HEAD
=======
import './global.css';
>>>>>>> 74f4f3b00d8fafa1397816d22f095f5bfe6ceee1

$(async () => {
  await waitGlobalInitialized('Mvu');
  createApp(App).use(createPinia()).mount('#app');
});
