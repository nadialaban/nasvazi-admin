<template>
  <div class="menu-area">
    <button class="btn btn-block" @click="change_state('schedule')"
            :style="btn_color('schedule')">Расписание</button>
    <button class="btn btn-block" @click="change_state('customers')"
            :style="btn_color('customers')">Гости</button>
    <button class="btn btn-block" @click="change_state('statistics')"
            :style="btn_color('statistics')">Аналитика</button>

    <img :src="images.logo" alt="">
  </div>
</template>

<script>
export default {
  name: "DashboardMenu",
  data() {
    return {
      state: 'statistics'
    }
  },
  methods: {
    btn_color: function (btn) {
      return 'background-color: ' + (btn === this.state ? '#f0f0f0' : 'white')
    },
    change_state: function (state) {
      this.state = state
      myEvent.fire('change-dashboard-state', state)
    }
  }
}
</script>

<style scoped>
.menu-area {
  position: fixed;
  top: 30px;
  bottom: 0;
  left: 0;
  width: 200px;
  background-color: white;
}

.btn-block {
  width: 100%;
  border-radius: 0;
  margin: 0;
  height: 40px;
}

.btn-block:hover, .btn-block:active, .btn-block:focus {
  border: transparent;
  background-color: #f0f0f0;
  height: 40px;
}

img {
  position: fixed;
  bottom: 20px;
  left: 10px;
  width: 180px;
}
</style>
