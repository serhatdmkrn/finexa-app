import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import store from './store';
import 'vue-search-select/dist/VueSearchSelect.css'
import { ModelListSelect  } from 'vue-search-select'
import Navbar from './components/Shared/Navbar.vue';
import Footer from './components/Shared/Footer.vue';

const app = createApp(App);
app.use(router);
app.use(store);
app.component("Navbar", Navbar);
app.component("Footer", Footer);
app.component("ModelListSelect", ModelListSelect);

app.mount('#app');
