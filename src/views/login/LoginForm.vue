<template>
  <v-card width="450px" class="login-card" outlined elevation="4">
    <slot></slot>
    <v-card-title primary-title> Login </v-card-title>
    <v-card-subtitle> Entre com seu email e senha </v-card-subtitle>
    <v-card-text class="login-form">
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="loginForm.email"
          outlined
          label="E-mail"
          :rules="[rules.required, rules.email]"
          dense
          color="#CE9D6B"
        ></v-text-field>

        <v-text-field
          v-model="loginForm.password"
          :rules="[rules.required]"
          outlined
          label="Senha"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          dense
          color="#CE9D6B"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
      <v-btn
        color="#CE9D6B"
        dark
        block
        elevation="1"
        class="login-btn"
        @click="formIsValid()"
        :loading="logging"
      >
        <strong> Entrar </strong>
      </v-btn>
    </v-card-text>
    <v-card-actions class="create-account">
      <v-row>
        <v-col cols="12">
          <span> Não possui uma conta? </span>
          <span class="new-account-link" @click="$emit('to-register')">
            Criar minha conta
          </span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import axiosInstance from "../../plugins/axiosInstance";

export default {
  data() {
    return {
      showPassword: false,
      logging: false,
      loginForm: {
        email: null,
        password: null,
      },
      rules: {
        required: (value) => !!value || "Insira os dados para logar",
        email: (value) => {
          if (!value) return "Email é obrigatório";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Email inválido";
          return true;
        },
      },
    };
  },

  methods: {
    formIsValid() {
      if (this.$refs.form.validate()) {
        this.login();
      }
    },

    login() {
      this.logging = true;
      axiosInstance
        .post(
          "/users/login",
          {
            email: this.loginForm.email,
            password: this.loginForm.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // faça algo com a resposta
          if (response.status == 200) {
            const { token } = response.data;
            localStorage.setItem("architectizer_token", token);
            this.$router.push({ name: "Home" });
          }
          this.logging = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.logging = false;
        });
    },
  },
};
</script>