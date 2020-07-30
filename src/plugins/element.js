import Vue from 'vue'
import { Button, Row, Col, 
    Dialog, Form, FormItem, Input,
     Message, MessageBox, Menu, MenuItem, MenuItemGroup,
     Submenu, Header, Table, TableColumn, Tabs, TabPane, Card } from 'element-ui'

Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Header)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Card)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
