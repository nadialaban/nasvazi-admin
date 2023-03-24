<template>
  <div style="background-color: #fbf3f3">
    <!-- Списание бонусов -->
    <foo name="bonus" width="600px" height="210px">
      <div class="container" v-if="!flags.done">
        <h5>Списание баллов</h5>
        <span>Бонусные баллы будут списаны у пользователя {{ current_user.name }} ({{ current_user.phone }})</span>
        <form-group48 class="margin" title="Количество:">
          <input type="number" min="0" step="1" :max="current_user.bonus" class="form-control shadow-none"
                 :class="flags.checked && !(0 < current_user.reduce_bonus && current_user.reduce_bonus <= current_user.bonus) ? 'is-invalid' : ''"
                 v-model="current_user.reduce_bonus" @change="$forceUpdate()"/>
        </form-group48>
        <form-group48 style="margin: -10px">
          <small class="card-text error" v-if="flags.checked && current_user.reduce_bonus > current_user.bonus" >Нельзя списать больше баллов, чем есть у гостя ({{current_user.bonus}})</small>
          <small class="card-text error" v-else-if="flags.checked && 0 > current_user.reduce_bonus">Нельзя списать количество баллов меньше 0.</small>
          <br v-else>
        </form-group48>
        <br>
        <button class="btn btn-primary" @click="reduce_bonus_save()">
          Списать бонусы ({{ current_user.reduce_bonus }})
        </button>
      </div>
      <div class="center-content" style="top: 90px; position: relative;" v-else>
        <h5 style="color: #7ca474">Баллы успешно списаны!</h5>
      </div>
    </foo>


    <div style="text-align: left">
      <download-excel class="btn btn-primary" worksheet="Гости" name="customers.xls" type="csv"
                      :data="data" :fields="json_fields">
        Выгрузить в CSV
      </download-excel>
    </div>

    <div class="content-container" :style="`top: ${window_height / 2}px;`" v-if="flags.loading">
      <loading/>
    </div>

    <!-- Табличка -->
    <table class="table table-striped align-middle" style="font-size: 12px" v-else>
      <thead style="color: #410002">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Имя</th>
        <th scope="col">Номер</th>
        <th class="vl" scope="col">Регистрация</th>
        <th scope="col" colspan="2">Бонусы</th>
      </tr>
      </thead>
      <tbody class="table-group-divider">
      <tr v-for="(user, index) in data">
        <th scope="row">{{ index + 1 }}</th>
        <td style="font-weight: 600">{{ user.name }}</td>
        <td>{{ user.phone }}</td>
        <td class="vl">{{ user.reg_date }}</td>
        <td>{{ user.bonus }}</td>
        <td>
          <button class="btn btn-sm btn-link" style="margin: 0"
                  :disabled="!user.bonus"
                  @click="reduce_bonus(user)">Списать
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <br>
  </div>
</template>

<script>
import axios from "axios";
import FormGroup48 from "../parts/FormGroup-4-8.vue";
import Loading from "../parts/Loading.vue";

export default {
  name: "GuestsManager",
  components: {Loading, FormGroup48},
  data() {
    return {
      current_user: {},
      flags: {
        loading: true,
        checked: false,
        done: false
      },
      data: [],
      json_fields: {
        'id': 'id',
        'Имя': 'name',
        'Номер телефона': 'phone',
        'Дата регистрации': 'reg_date',
        'Всего броней': 'totalBookings',
        'Подтвержденных броней': 'confirmedBookings',
        'Отмененных броней': 'cancelledBookings',
        'Бонусов': 'bonus'
      },
      json_meta: [[{
        key: "charset",
        value: "utf-8",
      }]],
    }
  },
  methods: {
    load_users: function () {
      this.flags.loading = true
      axios.get(this.url('/user/all')).then((response) => {
        this.data = response.data.users.map(user => {
          user.reg_date = `${this.zero_pad(user.addDate[2])}.${this.zero_pad(user.addDate[1])}.${user.addDate[0]}`
          return user
        })
        setTimeout(() => {
          this.flags.loading = false
        }, 1000)
      })
    },
    reduce_bonus: function (user) {
      this.current_user = user
      this.current_user.reduce_bonus = 0
      this.flags.checked = false
      this.flags.done = false
      this.$modal.show('bonus')
    },
    reduce_bonus_save: function () {
      this.flags.checked = true
      if (0 < this.current_user.reduce_bonus && this.current_user.reduce_bonus <= this.current_user.bonus) {
        axios
          .post(this.url('/user/reduce-bonus'), {
            userId: this.current_user.id,
            bonus: this.current_user.reduce_bonus
          })
          .then((response) => {
            this.flags.done = true
            this.current_user.bonus -= this.current_user.reduce_bonus
            this.current_user.reduce_bonus = 0
            this.$forceUpdate()
            setTimeout(() => this.$modal.hide('bonus'), 3000)
          })
      }
    }
  },
  mounted() {
    this.load_users()
    this.$modal.hide('bonus')
  }
}
</script>

<style scoped>
.vl {
  border-right: 1px solid #000;
}
</style>
