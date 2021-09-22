import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import './assets/main.scss'

Vue.use(ElementUI, { locale })

Vue.filter('money', (value, currency = 'EUR') => {
  const options = { minimumFractionDigits: 2 }
  options.style = 'currency'
  options.currency = currency

  return Intl.NumberFormat('de-DE', options).format(value)
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
