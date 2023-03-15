<template>
  <div class="container">
    <h5>Создание брони</h5>
    <form-group48 class="margin" title="Имя:">
      <input type="text" class="form-control shadow-none"
             :class="checked && is_empty(booking.name) ? 'is-invalid' : ''"
             v-model="booking.name"/>
    </form-group48>

    <form-group48 class="margin" title="Номер:">
      <vue-phone-number-input :no-example="true" class="form-shadow" style="border-radius: 4px"
                              default-country-code="RU" :only-countries="['RU']"
                              color="#9c4239" valid-color="#7ca474" error-color="#ba1a1a"
                              :translations="phone_translations"
                              v-model="booking.number"/>
    </form-group48>
    <form-group48 style="margin-top: -15px; text-align: end; padding-right: 14px;">
      <small :class="checked && !phone_re.exec(booking.number) ? 'error' : 'text-muted'">Формат ввода: ххх хх-хх-хх</small>
    </form-group48>
    <form-group48 class="margin" title="Количество гостей:">
      <input type="number" min="0" step="1" :max="booking.table.capacity" class="form-control shadow-none"
             :class="checked && !(0 < booking.participants && booking.participants <= booking.table.capacity) ? 'is-invalid' : ''"
             v-model="booking.participants" @change="$forceUpdate()"/>
    </form-group48>
    <form-group48 class="margin" title="Дата:">
      <date-picker format="DD.MM.YYYY, HH:00" class="date-picker" style="width: 100%"
                   :class="checked && !(booking.date.getHours() >= 12 || booking.date.getHours() === 0) ? 'is-invalid' : ''"
                   v-model="booking.date" @change="booking.date.setMinutes(0)"/>
    </form-group48>
    <form-group48 style="margin-top: -15px; text-align: end; padding-right: 14px;">
      <small
        :class="checked && !(booking.date.getHours() >= 12 || booking.date.getHours() === 0)  ? 'error' : 'text-muted'">
        Часы бронирования с 12:00 до 00:00</small>
    </form-group48>
    <form-group48 class="margin" title="Стол:">
      <select class="form-select" v-model="booking.table" @change="$forceUpdate()">
        <option :value="table" v-for="table in tables">{{ table.name }} ({{ table.capacity }} мест)
        </option>
      </select>
    </form-group48>
    <div style="margin: 10px;">
      <div style="text-align: left">
        <span class="text-muted">Комментарий:</span>
      </div>
      <textarea class="form-control monitoring-input" rows="5" v-model="booking.comment"/>
    </div>
    <small class="card-text error">{{ error }}</small> <br>

    <button class="btn btn-primary shadow-none" @click="create_booking()">Создать</button>
  </div>
</template>

<script>
import FormGroup48 from "./FormGroup-4-8.vue";
import axios from "axios";
import th from "vue2-datepicker/locale/es/th";

export default {
  name: "BookingEditor",
  props: ['tables'],
  components: {FormGroup48},
  data() {
    return {
      booking: {
        name: '',
        number: '',
        phone: '',
        comment: '',
        table: this.tables[0],
        participants: 1,
        date: new Date()
      },
      checked: false,
      error: ''
    }
  },
  methods: {
    check: function () {
      this.checked = true
      return !this.is_empty(this.booking.name) && this.phone_re.exec(this.booking.number) &&
        (this.booking.date.getHours() >= 12 || this.booking.date.getHours() === 0) &&
        0 < this.booking.participants && this.booking.participants <= this.booking.table.capacity
    },
    create_booking: function () {
      if (this.check()) {
        this.booking.date.setMinutes(0)
        this.booking.time = this.format_time(this.booking.date.getHours(), 0)
        this.booking.timeFrom = this.toISOString(this.booking.date)
        this.booking.tableName = this.booking.table.name
        this.booking.tableId = this.booking.table.id
        this.booking.phone = '+7 ' + this.booking.number
        axios
          .post(this.url('/booking/create'), this.booking)
          .then((response) => {
            this.booking.id = response.data.id
            this.booking.status = 'CREATED'
            Event.fire('add-booking', this.booking)
          })
          .catch((error) => {
            this.error = `Стол ${this.booking.tableName} занят в заданное время.`
          })
      } else {
        this.error = 'Проверьте корректность заполнения полей.'
      }
    }
  }
}
</script>

<style scoped>

</style>
