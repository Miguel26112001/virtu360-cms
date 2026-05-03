import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from "@/router/index.js";
import App from './App.vue'
import ToastService from 'primevue/toastservice';

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Dialog,
    Divider, Drawer,
    FileUpload, InputNumber,
    InputText,
    ProgressBar, ProgressSpinner, Select, SelectButton,
    Tag, Textarea, Toast,
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
    .use(ToastService)

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
    .component('Select', Select)
    .component('InputNumber', InputNumber)
    .component('SelectButton', SelectButton)
    .component('Textarea', Textarea)
    .component('ProgressSpinner', ProgressSpinner)
    .component('Toast', Toast)

    .directive('tooltip', Tooltip)

    .mount('#app');