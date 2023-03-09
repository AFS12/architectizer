<template>
  <section class="home-content">
    <h1>Bem vindo, {{ getUserName() }}!</h1> 
    <br />

    <v-card elevation="0">
      <v-card-title primary-title> Serviços solicitados </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-card class="service-card">
              <v-card-title primary-title> Titulo serviço </v-card-title>
              <v-card-text> Descrição serviço </v-card-text>
              <v-card-actions class="actions">
                <v-row>
                  <v-col>
                    <v-btn color="#5D6460" block dark>Rejeitar</v-btn>
                  </v-col>
                  <v-col>
                    <v-btn color="#CE9D6B" block dark>Aceitar</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import axiosInstance from "../../plugins/axiosInstance";

export default {
  data() {
    return {
      user: {},
    };
  },

  created() {
    axiosInstance
      .get(`/users/userdata/${localStorage.getItem("architectizer_token")}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // faça algo com a resposta
        if (response.status == 200) {
          this.user = response.data.user;
        }
      })
      .catch((error) => {
        // trate o erro
        console.log(error);
      });
  },

  methods: {
    getUserName() {
      const words = this.user.name.split(" ");
      return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    },
  },
};
</script>