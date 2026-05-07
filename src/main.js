import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura'
import router from "@/router/index.js";
import App from './App.vue'
import ToastService from 'primevue/toastservice';

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import {
    Avatar, BadgeDirective,
    Breadcrumb,
    Button,
    Card, Checkbox, ConfirmationService, ConfirmDialog,
    Dialog,
    Divider, Drawer,
    FileUpload, InputNumber,
    InputText, OverlayBadge,
    ProgressBar, ProgressSpinner, Select, SelectButton,
    Tag, Textarea, Toast,
    Tooltip
} from "primevue"

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            },
            dark: {
                surface: {
                    0: '{slate.950}',
                    50: '{slate.900}',
                    100: '{slate.850}',
                    200: '{slate.800}',
                    300: '{slate.700}',
                    400: '{slate.600}',
                    500: '{slate.500}',
                    600: '{slate.400}',
                    700: '{slate.300}',
                    800: '{slate.200}',
                    900: '{slate.100}',
                    950: '{slate.50}'
                }
            }
        }
    }
});

const app = createApp(App);
app
    .use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.my-app-dark',
                cssLayer: false
            }
        }
    })
    .use(router)
    .use(ToastService)
    .use(ConfirmationService)

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
    .component('OverlayBadge', OverlayBadge)
    .component('Checkbox', Checkbox)
    .component('ConfirmDialog', ConfirmDialog)

    .directive('badge', BadgeDirective)
    .directive('tooltip', Tooltip)

    .mount('#app');