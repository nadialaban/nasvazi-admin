// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import axios from 'axios'

import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
import VueConfirmDialog from 'vue-confirm-dialog'
import JsonExcel from "vue-json-excel";

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru';
import da from "vue2-datepicker/locale/es/da";
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'

window.Event = new class {
  constructor() {
    this.vue = new Vue();
  }

  fire(event, data = null, silent = false) {
    if (!silent) {
      if (!data && data !== 0) {
        console.log('sending event', event);
      } else {
        console.log('sending event', event, 'with data', data);
      }
    }

    this.vue.$emit(event, data);
  }

  listen(event, callback) {
    this.vue.$on(event, callback);
  }
};

Vue.mixin({
  methods: {
    url: function (route) {
      return 'https://nasvazi.herokuapp.com' + route
    },
    start_of_day: function (date) {
      date.setHours(0, 0, 0, 0)
      return date
    },
    format_time: function (hours, minutes) {
      return `${this.zero_pad(hours)}:${this.zero_pad(minutes)}`
    },
    format_date: function (day, month) {
      return `${this.zero_pad(day)}.${this.zero_pad(month)}`
    },
    zero_pad: function (number) {
      return `${number > 9 ? number : ('0' + number)}`
    },
    is_empty: function (str) {
      return !str || str === ''
    }
  },
  computed: {
    phone_translations() {
      return {
        countrySelectorLabel: 'Код страны',
        countrySelectorError: '',
        phoneNumberLabel: 'Номер телефона',
        example: 'Пример :'
      }
    },
    phone_re() {
      return /^\d{3} \d{3}-\d{2}-\d{2}$/
    },
    window_height() {
      return window.innerHeight
    }
  },
  data() {
    return {
      images: {
        logo: '/static/ns-logo.png'
      },
    }
  }
})

Vue.component('vue-phone-number-input', VuePhoneNumberInput)
Vue.use(VuePhoneNumberInput)

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.component('DatePicker', DatePicker)
Vue.component("downloadExcel", JsonExcel);

Vue.use(VModal, {componentName: 'Foo'})

new Vue({
  el: '#app',
  render: h => h(App)
})
