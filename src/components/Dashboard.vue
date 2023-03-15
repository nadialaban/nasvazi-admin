<template>
  <div class="dashboard-area" :style="`height: ${window_height - 30}px`">
    <bookings-manager v-if="state === 'schedule'"/>
    <guests-manager v-if="state === 'customers'"/>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from "./parts/Loading.vue";
import BookingsManager from "./views/BookingsManager.vue";
import GuestsManager from "./views/GuestsManager.vue";


export default {
  name: "Dashboard",
  components: {GuestsManager, BookingsManager, Loading},
  data() {
    return {
      state: 'schedule'
    }
  },
  computed: {},
  methods: {},
  created() {
    Event.listen('change-dashboard-state', (state) => this.state = state)
  }
}
</script>

<style scoped>
.dashboard-area {
  position: absolute;
  top: 30px;
  right: 0;
  left: 200px;
  padding: 10px;
  overflow-y: auto;
}

.form-control {
  height: 34px;
}

.btn-primary {
  margin: 0;
}
</style>
