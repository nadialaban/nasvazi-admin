<template>
  <div>
    <foo name="booking" width="600px" height="550px">
      <div class="center-content" style="top: 270px; position: relative;" v-if="flags.done">
        <h5 style="color: #7ca474">Бронь успешно создана!</h5>
      </div>
      <booking-editor :tables="tables" v-else/>
    </foo>

    <foo name="bonus" width="600px" height="200px">
      <div class="container" v-if="!flags.done">
        <h5>Начисление баллов</h5>
        <span>Бонусные баллы будут начислены пользователю {{ current_booking.userName }} ({{ current_booking.phone }})</span>
        <form-group48  class="margin" title="Сумма чека:">
          <input type="number" min="0" step="1" class="form-control shadow-none"
                 v-model="current_booking.total" @change="update_bonus()"/>
        </form-group48>
        <button class="btn btn-primary" @click="add_bonus_save()">
          Начислить бонусы ({{ current_booking.bonus }})
        </button>
      </div>
      <div class="center-content" style="top: 90px; position: relative;" v-else>
        <h5 style="color: #7ca474">Баллы успешно начислены!</h5>
      </div>
    </foo>

    <!-- Фильтры -->
    <div class="row">
      <span class="col-1 align-self-center" style="text-align: right">Дата:</span>
      <div class="col-3">
        <date-picker format="DD.MM.YYYY" class="date-picker" v-model="filters.date" @change="update()"/>
      </div>
      <span class="col-1 align-self-center" style="text-align: right">
          Место:
        </span>
      <div class="col-3">
        <select class="form-select" v-model="filters.table" @change="$forceUpdate()">
          <option :value="undefined">Все</option>
          <option :value="table.id" v-for="table in tables">{{ table.name }} ({{ table.capacity }} мест)
          </option>
        </select>
      </div>
      <div class="col-4 align-self-center" style="text-align: left;">
        <button class="btn btn-sm btn-primary" style="height: 34px; margin: 0"
                @click="add_booking()">Создать бронь
        </button>
      </div>
    </div>
    <hr>
    <!-- Данные -->
    <div class="content-container" :style="`top: ${window_height / 2}px;`" v-if="loading">
      <loading/>
    </div>
    <div class="row" style="padding-right: 15px;" v-if="!loading">
      <div v-if="!filtered_data.length">
        Нет броней по заданным фильтрам
      </div>
      <div class="col-3" style="padding-right: 0; margin-bottom: 5px;" v-for="booking in filtered_data">
        <booking-card :table="get_table(booking.tableId)" :booking="booking">
          <div style="">
            <button class="btn btn-sm btn-danger" v-if="booking.status === 'CREATED'"
                    @click="confirm_booking(booking)">Подтвердить
            </button>
            <button class="btn btn-sm btn-danger" v-if="booking.status === 'CONFIRMED'"
                    @click="add_bonus(booking)">Начислить баллы
            </button>
            <button class="btn btn-sm btn-secondary"
                    @click="cancel_booking(booking)">Отменить
            </button>
          </div>
        </booking-card>
      </div>
    </div>

  </div>
</template>

<script>
import BookingEditor from "../parts/BookingEditor.vue";
import Loading from "../parts/Loading.vue";
import BookingCard from "../parts/BookingCard.vue";
import axios from "axios";
import FormGroup48 from "../parts/FormGroup-4-8.vue";

export default {
  name: "BookingsManager",
  components: {FormGroup48, BookingCard, Loading, BookingEditor},
  data() {
    return {
      loading: true,
      filters: {
        date: undefined,
        table: undefined
      },
      tables: [],
      data: [],
      current_booking: {},
      flags: {
        done: false
      }
    }
  },
  computed: {
    filtered_data() {
      let filtered = []
      filtered = this.data.filter((booking) => booking.status !== 'CANCELLED')
      if (this.filters.table) filtered = filtered.filter(booking => booking.tableId === this.filters.table)

      return filtered
    }
  },
  methods: {
    clear_filters: function () {
      this.filters.date = this.start_of_day(new Date())
    },
    update: function () {
      this.filters.date = this.start_of_day(this.filters.date)
      this.load_bookings()
    },
    load_tables: function () {
      axios.get(this.url('/table/all')).then((response) => {
        this.tables = response.data.tables
        this.load_bookings()
      })
    },
    get_table: function (id) {
      let table = this.tables.filter(s => s.id === id)[0]
      return table ? table.name : 'Стол'
    },
    update_bonus: function () {
      this.current_booking.bonus = this.current_booking.total ? Math.ceil(this.current_booking.total / 10) : 0
      this.$forceUpdate()
    },
    cancel_booking: function (booking) {
      this.$confirm({
        message: `Вы уверены, что хотите удалить бронь на ${booking.time} (${booking.userName})?`,
        button: {
          no: 'Нет',
          yes: 'Да'
        },
        callback: confirm => {
          if (confirm) {
            axios
              .post(this.url('/booking/cancel'), {bookingId: booking.id})
              .then((response) => {
                booking.status = 'CANCELLED'
                this.update()
              })
          }
        }
      })
    },
    confirm_booking: function (booking) {
      this.$confirm({
        message: `Вы уверены, что хотите подтвердить бронь на ${booking.time} (${booking.userName})?`,
        button: {
          no: 'Нет',
          yes: 'Да'
        },
        callback: confirm => {
          if (confirm) {
            axios
              .post(this.url('/booking/confirm'), {bookingId: booking.id})
              .then((response) => {
                booking.status = 'CONFIRMED'
                this.update()
              })
          }
        }
      })
    },
    add_bonus: function (booking) {
      this.current_booking = booking
      this.current_booking.total = 0
      this.current_booking.bonus = 0
      this.flags.done = false
      this.$modal.show('bonus')
    },
    add_bonus_save: function () {
      axios
        .post(this.url('/user/add-bonus'), {
          userId: this.current_booking.userId,
          bonus: this.current_booking.bonus
        })
        .then((response) => {
          this.flags.done = true
          this.current_booking.total = 0
          this.current_booking.bonus = 0
          this.$forceUpdate()
          setTimeout(() => this.$modal.hide('bonus'), 2000)
        })
    },
    add_booking: function () {
      this.flags.done = false
      this.$modal.show('booking')
    },
    load_bookings: function () {
      this.loading = true
      let date = `${this.filters.date.getFullYear()}-` +
        `${this.zero_pad(this.filters.date.getMonth() + 1)}-` +
        `${this.zero_pad(this.filters.date.getDate())}`

      axios
        .get(this.url('/booking/by-date'), {params: {date: date}})
        .then((response) => {
          this.data = response.data.bookings.map((booking) => {
            booking.formatted_date = this.format_date(booking.startTime[2], booking.startTime[1])
            booking.time = this.format_time(booking.startTime[3], booking.startTime[4])
            return booking
          })
          this.data.sort((a, b) => {
            return a.startTime[3] < b.startTime[3] ? -1 : a.startTime[3] > b.startTime[3] ? 1 : 0
          })
          this.loading = false
        })
    }
  },
  created() {
    this.clear_filters()
    this.load_tables()

    Event.listen('add-booking', (booking) => {
      this.flags.done = true
      if (this.toISOString(this.filters.date).split('T')[0] === this.toISOString(booking.date).split('T')[0]) {
        booking.formatted_date = this.format_date(booking.date.getDate(), booking.date.getMonth())
        booking.time = this.format_time(booking.date.getHours(), booking.date.getMinutes())
        this.data.push(booking)
        this.data.sort((a, b) => {
          return a.startTime[3] < b.startTime[3] ? -1 : a.startTime[3] > b.startTime[3] ? 1 : 0
        })
      }
      setTimeout(() => this.$modal.hide('booking'), 2000)
    })
  },
  mounted() {
    this.load_bookings()
    this.$modal.hide('booking')
    this.$modal.hide('bonus')
  }
}
</script>

<style scoped>

</style>
