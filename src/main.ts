import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './main.css';
import App from './App.vue'
import router from './router'
import 'maz-ui/styles'
import * as MazUI from 'maz-ui'
import { installToaster, ToasterOptions } from 'maz-ui'
const app = createApp(App)

const toasterOptions: ToasterOptions = {
                position: 'bottom-left',
                timeout: 10_000,
                persistent: false,
              }
              
              app.use(installToaster, toasterOptions)
app.use(createPinia()) //use pinia
app.use(router) //use router

app.mount('#app')

