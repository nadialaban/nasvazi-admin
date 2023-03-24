<template>
  <div style="background-color: #fbf3f3">
    <h5 style="text-align: left;">Статистика по бронированиям</h5>
    <!-- Фильтры -->
    <div class="row" style="margin-bottom: 10px">
      <div class="col-3">
        <date-picker format="с DD.MM.YYYY" class="date-picker" v-model="filters.dateFrom" @change="load_bookings()"/>
      </div>
      <div class="col-3">
        <date-picker format="по DD.MM.YYYY" class="date-picker" v-model="filters.dateTo" @change="load_bookings()"/>
      </div>
    </div>
    <div class="row" >
      <div class="col-8" style="padding-right: 5px;">
        <chart-card type="bookings"/>
      </div>
      <div class="col-4" style="padding-left: 5px;">
        <chart-card type="source"/>
      </div>
    </div>
    <hr>
    <h5 style="text-align: left;">Статистика по гостям</h5>
    <div class="row">
      <div class="col-6" style="padding-right: 5px;">
        <chart-card type="userBookings"/>
      </div>
      <div class="col-6" style="padding-left: 5px;">
        <chart-card type="userBonus"/>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "../parts/Loading.vue";
import ChartCard from "../parts/ChartCard.vue";

export default {
  name: "StatisticsPresenter",
  components: {ChartCard, Loading},
  data() {
    return {
      filters: {
        dateFrom: undefined,
        dateTo: undefined
      },
      flags: {
        bookings_loading: true,
        user_loading: true
      },
      users: []
    }
  },
  computed: {
    datesArray() {
      let current_date = this.filters.dateFrom
      let arr = []

      while (current_date <= this.filters.dateTo) {
        arr.push(this.format_date(current_date.getDate(), current_date.getMonth() + 1))
        current_date = this.add_days(current_date, 1)
      }
      return arr
    }
  },
  methods: {
    clear_filters: function () {
      let today = new Date()
      this.filters.dateFrom = this.start_of_day(this.add_days(today, -14))
      this.filters.dateTo = this.end_of_day(today)
    },
    load: function () {
      this.load_bookings()
      this.load_users()
    },
    load_bookings: function () {
      this.flags.bookings_loading = true
      myEvent.fire('set-loading')

      let from = this.format_full_date(this.filters.dateFrom)
      let to = this.format_full_date(this.filters.dateTo)

      axios.get(this.url('/booking/aggregate-by-date', {
        startDate: from,
        endDate: to
      }))
        .then((response) => {
          let data = response.data.analysisBookingDtos
          data.forEach((date) => {
            date.date = this.format_date(date.date[2], date.date[1])
          })
          let new_data = this.datesArray.map((date) => {
            let values = data.filter((d) => d.date === date)
            if (values.length) {
              return values[0]
            } else {
              return {
                total: 0,
                confirmed: 0,
                cancelled: 0,
                tgQty: 0,
                androidQty: 0,
                webQty: 0,
                unknownPlatformQty: 0
              }
            }
          })
          setTimeout(() => {
            this.flags.bookings_loading = false

            myEvent.fire('update-bookings-data', {
              data: new_data,
              categories: this.datesArray
            })
          }, 1000)
        })
    },
    load_users: function () {
      this.flags.user_loading = true
      axios.get(this.url('/user/all')).then((response) => {
        let data = response.data.users
        axios.get(this.url('/analytics/aggregate-bonus-by-user')).then((response) => {
          let bonus_data = response.data.analysisBonusDtos
          data.forEach((user) => {
            let user_bonus = bonus_data.filter((u) => u.userId === user.id)
            if (user_bonus.length) {
              user.bonusReduce = user_bonus[0].qtyReduce
              user.rubbleReduce = user_bonus[0].qtyAdd * 10
            } else {
              user.bonusReduce = 0
              user.rubbleReduce = 0
            }
          })
          setTimeout(() => {
            this.flags.user_loading = false

            myEvent.fire('update-user-data', {
              data: data,
              categories: data.map(user => user.name)
            })
          }, 1000)
        })
      })
    }
  },
  mounted() {
    this.clear_filters()
    this.filters.bookings_loading = false
    this.filters.user_loading = false
    this.load()
  }
}
</script>

<style scoped>
</style>
