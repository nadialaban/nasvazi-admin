<template>
  <div class="card text-left">

    <div class="card-header">
      <h6 class="card-title">{{ titles[type] }}</h6>
    </div>

    <div class="card-body" style="min-height: 100px">
      <div class="content-container" style="margin-top: 20px;" v-show="flags.loading">
        <loading/>
      </div>
      <line-chart :id="type" v-if="['bookings'].includes(type)" v-show="!flags.loading"/>
      <pie-chart :id="type" v-if="['source'].includes(type)" v-show="!flags.loading"/>
      <bar-chart :id="type" :stacked="['userBookings'].includes(type)"
                 v-if="['userBookings', 'userBonus'].includes(type)" v-show="!flags.loading"/>
      <br>
    </div>
  </div>

</template>

<script>
import LineChart from "./charts/LineChart.vue";
import PieChart from "./charts/PieChart.vue";
import BarChart from "./charts/BarChart.vue";
import Loading from "./Loading.vue";

export default {
  name: "ChartCard",
  components: {Loading, BarChart, PieChart, LineChart},
  props: {
    type: {required: true}
  },
  data() {
    return {
      titles: {
        bookings: 'Бронирования',
        source: 'Источник бронирования',
        userBookings: 'Бронирования',
        userBonus: 'Программа лояльности'
      },
      flags: {
        loading: true
      },
      data: undefined,
      options: undefined
    }
  },
  methods: {
    prepare_data: function (data, categories) {
      if (this.type === 'bookings') {
        this.data = [{
          name: 'Всего',
          data: data.map(date => date.total)
        }, {
          name: 'Подтверждено',
          data: data.map(date => date.confirmed)
        }, {
          name: 'Отменено',
          data: data.map(date => date.cancelled)
        }]

        let max = Math.max(...this.data.map((line) => {
          return Math.max(...line.data)
        }))

        this.options = {
          categories: categories,
          title: 'Количество',
          max: max + 2,
          colors: ['#f6cf75', '#7ca474', '#ff897d']
        }
      } else if (this.type === 'source') {
        this.data = [{
          name: 'Telegram',
          data: data.map(date => date.tgQty)
        }, {
          name: 'Android',
          data: data.map(date => date.androidQty)
        }, {
          name: 'Администратор',
          data: data.map(date => date.webQty)
        }, {
          name: 'Неизвестно',
          data: data.map(date => date.unknownPlatformQty)
        }]

        this.options = {
          categories: this.data.map(gr => gr.name),
          colors: ['#f6cf75', '#7ca474', '#caa29d', '#d0c4c2']
        }

        this.data = this.data.map(gr => gr.data.reduce((partialSum, a) => partialSum + a, 0))
      } else if (this.type === 'userBookings') {
        this.data = this.data = [{
          name: 'Подтверждено',
          data: data.map(user => user.confirmedBookings)
        }, {
          name: 'Отменено',
          data: data.map(user => user.cancelledBookings)
        }, {
          name: 'Не подтверждено',
          data: data.map(user => user.totalBookings - user.confirmedBookings - user.cancelledBookings)
        }]

        this.options = {
          categories: categories,
          colors: ['#7ca474', '#ff897d', '#d0c4c2']
        }
      } else if (this.type === 'userBonus') {
        this.data = this.data = [{
          name: 'Потрачено рублей',
          data: data.map(user => user.rubbleReduce)
        }, {
          name: 'Потрачено бонусов',
          data: data.map(user => user.bonusReduce * -1)
        }]

        this.options = {
          categories: categories,
          colors: ['#7ca474', '#ff897d']
        }
      }
      myEvent.fire('loaded-' + this.type, {
        data: this.data,
        options: this.options
      })
      this.flags.loading = false
    }
  },
  created() {
    if (['userBookings', 'userBonus'].includes(this.type)) {
      myEvent.listen('update-user-data', (data) => {
        this.prepare_data(data.data, data.categories)
      })
    } else {
      myEvent.listen('set-loading', () => this.flags.loading = true)
      myEvent.listen('update-bookings-data', (data) => {
        this.prepare_data(data.data, data.categories)
      })
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 10px;
  background-repeat: no-repeat;
  background-position: right 5px bottom 5px;
  background-size: 55px;
  height: 100%;
}

.card a {
  font-size: 0.75rem;
}

.card-body {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: start;
  padding: 10px 10px 0;
}

.card-header {
  text-align: left;
  background-color: white;
  border-bottom: none;
  height: 30px;
  padding: 10px 0 0 10px;
}


</style>

<style>
.apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title {
  background-color: #ffdad5;
}
</style>
