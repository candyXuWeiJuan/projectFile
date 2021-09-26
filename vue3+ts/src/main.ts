import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'element-plus/lib/theme-chalk/index.css'
import '@/style/index.scss'
import lodash from 'lodash'
import ElementPlus from 'element-plus'
import Page from '@/components/Page.vue'
import Header from '@/components/Header.vue'
import Dialog from '@/components/Dialog.vue'
import Table from '@/components/Table.vue'
import Form from '@/components/form/index.vue'
const app = createApp(App)
app.config.globalProperties.$lodash = lodash
app.use(router)
app.use(ElementPlus, { size: 'mini' }).mount('#app')
app.component(Header.name, Header)
app.component(Page.name, Page)
app.component(Dialog.name, Dialog)
app.component(Table.name, Table)
app.component(Form.name, Form)
window.app = app
