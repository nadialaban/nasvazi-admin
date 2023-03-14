<template>
  <div class="card text-left">

    <div class="card-header">
      <h6 class="card-title">{{booking.formatted_date}} {{ booking.time }}, {{ table }}</h6>
    </div>

    <div class="card-body">
      <div class="card-text">
        <span v-html="statuses[booking.status]"/>
        <div class="row">
          <div class="col-4 text-muted text-nowrap">
            На имя:<br>
            Номер:<br>
            Гостей:<br>
          </div>
          <div class="col">
            {{ booking.userName }}<br>
            {{ booking.phone }}<br>
            {{ booking.participants }}<br>
          </div>
        </div>
        <br>
        <span class="text-muted" v-if="booking.comment"><i>{{booking.comment}}</i></span>
      </div>
    </div>

    <div class="card-footer">
      <slot></slot>
    </div>

  </div>
</template>


<script>
import tr from "vue2-datepicker/locale/es/tr";

export default {
  name: "BookingCard",
  props: {
    booking: {
      required: true
    },
    table: {
      required: true
    }
  },
  data() {
    return {
      statuses: {
        CREATED: '<span style="color: #ba1a1a">Не подтверждена</span>',
        CANCELLED: '<span style="color: #ba1a1a">Отмена</span>',
        CONFIRMED: '<span style="color: #7ca474">Подтверждена</span>'
      }
    }
  },
  methods: {}
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
  padding: 10px;
}

.card-text {
  font-size: 13px;
  text-align: left;
}
.row {
  column-gap: 0;
}

.card-header {
  text-align: left;
  background-color: white;
  border-bottom: none;
  height: 30px;
  padding: 10px 0 0 10px;
}

.card-footer {
  text-align: left;
  background-color: white;
  border-top: none;
  padding: 0 0 5px 10px;
}
</style>
