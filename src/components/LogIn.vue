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
          <small class="card-text error">{{ error }}</small><br>
          <button class="btn btn-primary shadow-none" @click="get_code()">Получить код</button>
        </div>
        <div v-if="state === 'code'">
          <p class="card-text text-muted">СМС с кодом подтверждения отправлено на номер
            <br>
            +7 {{ number }}.</p>
          <pincode-input v-model="code"/>
          <br>
          <small class="card-text error">{{ error }}</small>
          <button class="btn btn-primary shadow-none" @click="check_code()">Подтвердить</button>
          <br>
          <button class="btn btn-link text-muted shadow-none" style="font-size: small; margin: 0"
                  @click="state = 'number'">Изменить номер
          </button>
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
      userId: 31,
      error: '\n'
    }
  },
  computed: {},
  methods: {
    get_code: function () {
      console.log({
        phone: '+7 ' + this.number,
        expectedRole: 'ADMIN'
      })
      if (this.phone_re.exec(this.number)) {
        axios
          .post(this.url('/auth/login'), {
            phone: '+7 ' + this.number,
            chatId: '',
            name: '',
            expectedRole: 'ADMIN'
          })
          .then((response) => {
            if (response.data.status === 'FAIL') {
              this.error = 'Ошибка доступа'
            } else {
              this.error = ''
              this.userId = response.data.userId ? response.data.userId : 31
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
        axios
          .post(this.url('/auth/confirm-number'), {
            userId: this.userId,
            code: this.code
          })
          .then((response) => {
            if (response.data.status === 'SUCCESS') {
              Event.fire('authorised', response.data.user)
            }
          })
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
