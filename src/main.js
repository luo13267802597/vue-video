// 入口文件
import Vue from 'vue'
import App from './App.vue'

// 导入字体图标
import './lib/mui/fonts/iconfont.css'

var vm = new Vue({
  el: '#app',
  render: c => c(App),

})