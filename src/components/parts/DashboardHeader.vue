<template>
  <div class="header">
    <h6 style="margin-left: 10px; position: absolute;">
      <span class="material-symbols-outlined">settings</span>
      Панель администратора ({{ admin }})</h6>
    <button class="btn btn-sm btn-link text-right exit" @click="exit()">Выйти</button>
  </div>
</template>

<script>
export default {
  name: "DashboardHeader",
  props: ['admin'],
  methods: {
    exit: function () {
      this.$confirm({
        message: 'Вы уверены, что хотите выйти из панели администратора?',
        button: {
          no: 'Нет',
          yes: 'Да'
        },
        callback: confirm => {
          if (confirm) {
            myEvent.fire('exit')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  bottom: auto;
  top: 0;
  height: 30px;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fffbff;
  text-align: left;
  padding-left: 10px;
}

.exit {
  margin-top: 0;
  position: absolute;
  right: 15px;
}

.material-symbols-outlined {
  font-size: 20px;
  top: 4px;
  position: relative;
}
</style>
