<template>
  <section class="home-content">
    <h1>Bem vindo, {{ getUserName() }}!</h1>
    <br />

    <ArchitectPanel
      :loadingData="loadingData"
      :services="services"
      @loadingData="loadingData = true"
      @updateServicesDate="basicRequisition()"
      v-if="user.type == 1"
    />

    <ClientPanel
      :loadingData="loadingData"
      :architects="architects"
      :user="user"
      @loadingData="loadingData = true"
      @updateServicesDate="basicRequisition()"
      v-else
    />
  </section>
</template>
<script>
import axiosInstance from "../../plugins/axiosInstance";
import ArchitectPanel from "./ArchitectPanel.vue";
import ClientPanel from "./ClientPanel.vue";
import capitalizeName from "../../plugins/capitalize";

export default {
  components: {
    ArchitectPanel,
    ClientPanel,
  },

  data() {
    return {
      user: {},
      services: [],
      architects: [],
      loadingData: false,
    };
  },

  created() {
    this.basicRequisition();
  },

  methods: {
    getUserName() {
      if (this.user.name) {
        return capitalizeName(this.user.name);
      }
    },

    async basicRequisition() {
      this.loadingData = true;
      await axiosInstance
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

      if (this.user.type == 1) {
        await axiosInstance
          .get(`/services/${this.user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            // faça algo com a resposta
            if (response.status == 200) {
              this.services = response.data.services;
              this.loadingData = false;
            }
          })
          .catch((error) => {
            // trate o erro
            console.log(error);
          });
      }

      if (this.user.type == 0) {
        await axiosInstance
          .get(`/users/architects`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            // faça algo com a resposta
            if (response.status == 200) {
              this.architects = response.data.architects;
              this.loadingData = false;
            }
          })
          .catch((error) => {
            // trate o erro
            console.log(error);
          });
        this.loadingData = false;
      }
    },
  },
};
</script>