<template>
  <v-row class="login">
    <v-col cols="6" style="padding: 0">
      <v-img src="/images/login-img.jpg" height="101vh" width="55vw"></v-img>
    </v-col>
    <v-col cols="6" class="login-register">
      <v-icon :class="register ? 'logo-register' : 'logo-login'">
        mdi-arch
      </v-icon>
      <div :class="register ? 'logo-title-register' : 'logo-title-login'">
        <h1>
          ARTHUR
        </h1>
        <h3>
          ARCHITECTIZER        
        </h3>
      </div>
      <LoginForm @loginFail="loginFail()" @to-register="register = true" v-show="!register">
        <v-row class="created-alert">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-alert
              :type="alertColor"
              :value="alert"
              transition="scale-transition"
            >
              {{alertMessage}}
              <v-progress-linear
              :active="alert"
              :value="Math.floor(100 * (currentTime / 4000))"
              absolute
              bottom
              color="white"
            ></v-progress-linear>
            </v-alert>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </LoginForm>
      <RegisterFormVue @created="successRegister()" @to-login="register = false" v-show="register" />
      <footer class="footer">Arthur © 2023</footer>
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import RegisterFormVue from "./RegisterForm.vue";
import jwtValidate from "../../plugins/jwtValidate";

export default {
  components: {
    LoginForm,
    RegisterFormVue,
  },

  data() {
    return {
      alertColor: 'success',
      alertMessage: '',
      register: false,
      alert: false,
      currentTime: 0,
    };
  },

  watch: {
    alert(v) {
      if (v) {
        this.syncPbar()
      }
    },
  },
  
  created() {
    const token = localStorage.getItem("architectizer_token");
    if (jwtValidate(token)) {
      this.$router.push({ name: "Home" });
    } else {
      localStorage.removeItem('architectizer_token');
    }
  },

  methods: {

    loginFail(){
      this.alertColor = 'error',
      this.alertMessage = 'Dados de login incorretos'
      this.alert = true
    },

    successRegister(){
      this.alertColor = 'success',
      this.alertMessage = 'Conta criada com sucesso'
      this.register = false
      this.alert = true
    },
    
    syncPbar() {
      //Create a timeout every 100 miliseconds
      setTimeout(() => {
        //Increment the time counter by 100
        this.currentTime += 100

        //If our current time is larger than the timeout
        if (4000 <= this.currentTime) {
          //Wait 500 miliseconds for the dom to catch up, then reset the snackbar
          setTimeout(() => {
            this.alert = false //Update the alert to false
            this.currentTime = 0 // reset the current time
          }, 500)
        } else {
          //Recursivly update the progress bar
          this.syncPbar()
        }
      }, 100)
    },
  },
};
</script>

<style lang="scss">
</style>