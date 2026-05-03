import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from "@/router/index.js";
import App from './App.vue'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Dialog,
    Divider, Drawer,
    FileUpload,
    InputText,
    ProgressBar,
    Tag,
    Tooltip
} from "primevue"

const app = createApp(App);
app
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(router)
    .component('Button', Button)
    .component('Divider', Divider)
    .component('Avatar', Avatar)
    .component('Breadcrumb', Breadcrumb)
    .component('Card', Card)
    .component('Tag', Tag)
    .component('Dialog', Dialog)
    .component('InputText', InputText)
    .component('FileUpload', FileUpload)
    .component('ProgressBar', ProgressBar)
    .component('Drawer', Drawer)

    .directive('tooltip', Tooltip)

    .mount('#app');