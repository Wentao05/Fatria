import App from './App.vue';
<<<<<<< HEAD
=======
import './global.css';
>>>>>>> 4e5049c48ba60ffb6caf6bf2fd6c7e846f4d4480

$(async () => {
  await waitGlobalInitialized('Mvu');
  createApp(App).use(createPinia()).mount('#app');
});
