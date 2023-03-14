<template>
  <div class="content-container" style="width: 350px;">
    <div class="card">
      <div class="text-center">
        <img :src="images.logo" class="card-img-top logo" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-text label-light">Панель администратора</h5>
        <div v-if="state === 'number'">
          <vue-phone-number-input :no-example="true" class="form-shadow" style="border-radius: 4px"
                                  default-country-code="RU" :only-countries="['RU']"
                                  color="#9c4239" valid-color="#7ca474" error-color="#ba1a1a"
                                  :translations="phone_translations"
                                  v-model="number"/>
          <small class="card-text error">{{ error }}</small>
          <button class="btn btn-primary shadow-none" @click="get_code()">Получить код</button>
        </div>
        <div v-if="state === 'code'">
          <p class="card-text  text-muted">СМС с кодом подтверждения отправлено на номер
            <br>
            +7 {{number}}.</p>
          <pincode-input v-model="code"/>
          <p class="card-text error">{{ error }}</p>
          <button class="btn btn-primary shadow-none" @click="check_code()">Подтвердить</button>
          <br>
          <button class="btn btn-link text-muted shadow-none"  style="font-size: small; margin: 0"
                  @click="state = 'number'">Изменить номер</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PincodeInput from "vue-pincode-input";
import axios from "axios";

export default {
  name: "LogIn",
  components: {PincodeInput},
  data() {
    return {
      state: 'number',
      number: '',
      code: '',
      error: '\n'
    }
  },
  computed: {
  },
  methods: {
    get_code: function () {
      if (this.phone_re.exec(this.number)) {
        axios
          .post(this.url('/auth/login'), {
            phone: '+7' + this.number.replace(/[- ]/, ''),
            expectedRole: 'ADMIN'
          })
          .then((response) => {
            if (response.data.status === 'FAIL') {
              this.error = 'Ошибка доступа'
            } else {
              this.error = '\n'
              this.state = 'code'
            }
          })
      } else {
        this.error = 'Пожалуйста, проверьте корректность ввода'
      }
    },
    check_code: function () {
      if (this.code.length === 4) {
        this.error = ''
        Event.fire('authorised')
      } else {
        this.error = 'Пожалуйста, проверьте корректность ввода'
      }
    }
  }
}
</script>

<style scoped>
.logo {
  width: 100px;
  margin-top: 20px;
}

.btn-primary {
  width: 150px;
}

</style>
