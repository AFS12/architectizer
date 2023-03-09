<template>
  <v-app class="main-layout">
    <v-app-bar
      :elevation="0"
      class="app-bar-styles"
      app
      height="50px"
    >
      <h3 class="title">
        <v-icon class="icon"> mdi-arch </v-icon>
        ARCHITECTIZER
      </h3>
      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import jwtValidate from "../../plugins/jwtValidate";

export default {
  created() {
    const token = localStorage.getItem("architectizer_token");
    if (token == undefined || token == null || token == "" || !jwtValidate(token)) {
      localStorage.removeItem('architectizer_token');
      this.$router.push({ name: "Login" });
    }
  },
};
</script>
