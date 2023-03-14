<template>
  <div id="app">
    <vue-confirm-dialog/>
    <log-in v-if="state === 'login'"/>
    <div v-if="state === 'dashboard'">
      <dashboard-header :admin="admin.name"/>
      <dashboard-menu/>
      <dashboard :admin="admin"/>
    </div>
  </div>
</template>

<script>
import DashboardHeader from "./components/parts/DashboardHeader.vue";
import LogIn from "./components/LogIn.vue";
import Dashboard from "./components/Dashboard.vue";
import DashboardMenu from "./components/parts/DashboardMenu.vue";

export default {
  name: 'App',
  components: {
    Dashboard,
    LogIn,
    DashboardHeader,
    DashboardMenu
  },
  data() {
    return {
      state: 'dashboard',
      admin: {
        name: 'Надя'
      }
    }
  },
  methods: {},
  created() {
    Event.listen('authorised', () => this.state = 'dashboard')
  }
}
</script>

<style>
#app {
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fbf3f3;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.btn-sm {
  font-size: 12px;
  font-weight: 600;
}

.btn {
  margin-top: 10px;
  margin-bottom: 5px;
  border-radius: 0.3rem;
  letter-spacing: 0.05em;
}

.btn-primary {
  background-color: #9c4239;
  border-color: #9c4239;
}

.btn-primary:hover, .btn-primary:active {
  background-color: #775652 !important;
  border-color: #775652 !important;
}

.btn-secondary {
  background-color: #ffdad5;
  border-color: #ffdad5;
  color: #2c1512;
}

.btn-secondary:hover, .btn-secondary:active {
  background-color: #fddfdc !important;
  border-color: #fddfdc !important;
  color: #2c1512 !important;
}

.btn-danger {
  background-color: #fddfa6;
  border-color: #fddfa6;
  color: #261a00;
}


.btn-danger:hover, .btn-danger:active {
  background-color: #ffe5b6 !important;
  border-color: #ffe5b6 !important;
  color: #261a00 !important;
}

.content-container {
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.error {
  color: #ba1a1a;
}

.vc-btn, .btn-link {
  color: #9c4239;
}

.form-shadow {
  box-shadow: 0 0 2px rgb(0 0 0 / 40%);
}

.form-select, .form-control {
  font-size: 14px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  color: #410002;
}

span {
  font-size: 14px;
}

small{
  font-size: 11px;
}

.modal {
  border-radius: 0.4rem;
}

.date-picker {
  width: 100%;
}


.margin {
  margin: 10px 0;
}

.container {
  padding: 15px;
}
</style>
