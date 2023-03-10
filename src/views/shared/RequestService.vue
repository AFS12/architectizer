<template>
  <section class="request-dialog">
    <v-card :loading="loading">
      <v-card-title class="text-h5 grey lighten-2">
        Solicitar serviço para {{ getArchitectName() }}
      </v-card-title>

      <v-card-text class="request-form">
        <v-form ref="form" lazy-validation>
          <v-row dense>
            <v-col>
              <v-text-field
                v-model="requestForm.title"
                outlined
                label="Titulo do serviço"
                :rules="[rules.required]"
                dense
                color="#CE9D6B"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <v-textarea
                counter="300"
                v-model="requestForm.description"
                outlined
                label="Descrição do serviço"
                auto-grow
                :rules="[rules.required, rules.textLimitRule]"
                rows="3"
                color="#CE9D6B"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="#5D6460" text @click="cancelRequest()" :disabled="alert">
          <strong> Cancelar </strong>
        </v-btn>
        <v-spacer></v-spacer>

        <v-alert
          type="success"
          :value="alert"
          dense
          transition="scale-transition"
        >
          {{ alertMessage }}
          <v-progress-linear
            :active="alert"
            :value="Math.floor(100 * (currentTime / 1000))"
            absolute
            bottom
            color="#E0E0DF"
          ></v-progress-linear>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn
          color="#CE9D6B"
          v-show="!edit.active"
          text
          @click="confirmRequest()"
          :disabled="alert"
        >
          <strong> Solicitar </strong>
        </v-btn>

        <v-btn
          color="#CE9D6B"
          v-show="edit.active"
          text
          @click="updateService()"
          :disabled="alert"
        >
          <strong> Atualizar </strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>
<script>
import axiosInstance from "../../plugins/axiosInstance";
import capitalizeName from "../../plugins/capitalize";

export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "Esse campo é obrigatorio",
        textLimitRule: (value) =>
          value.length <= 300 ||
          "O texto inserido deve ter no máximo 300 caracteres.",
      },
      requestForm: {
        title: "",
        description: "",
      },
      loading: false,
      register: false,
      alert: false,
      currentTime: 0,
      alertMessage: "",
    };
  },

  props: {
    user: Object,
    architect: Object,
    edit: {
      type: Object,
      default: () => {
        return {
          id: null,
          title: "",
          description: "",
          active: false,
        };
      },
    },
    rowClickable: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    if (this.edit.active == true) {
      this.requestForm.title = this.edit.title;
      this.requestForm.description = this.edit.description;
    }
  },

  methods: {
    confirmRequest() {
      this.loading = true;

      if (!this.$refs.form.validate()) {
        this.loading = false;
        return;
      }

      axiosInstance
        .post(
          "/services",
          {
            architect_id: this.architect.id,
            client_id: this.user.id,
            title: this.requestForm.title,
            description: this.requestForm.description,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // faça algo com a resposta
          if (response.status == 201) {
            this.alertMessage = response.data;
            this.successRegister();
          }
          this.loading = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.loading = false;
        });
    },

    updateService() {
      this.loading = true;

      if (!this.$refs.form.validate()) {
        this.loading = false;
        return;
      }

      axiosInstance
        .put(
          "/services/update",
          {
            id: this.edit.id,
            title: this.requestForm.title,
            description: this.requestForm.description,
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
            this.alertMessage = response.data;
            this.successRegister();
          }
          this.loading = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.loading = false;
        });
    },

    cancelRequest() {
      this.requestForm = {
        title: "",
        description: "",
      };
      this.$refs.form.resetValidation();
      this.$emit("closeDialog");
    },

    getArchitectName() {
      if (this.architect.name) {
        return capitalizeName(this.architect.name);
      }
    },

    successRegister() {
      this.register = false;
      this.alert = true;
      this.syncPbar();
    },

    syncPbar() {
      //Create a timeout every 100 miliseconds
      setTimeout(() => {
        //Increment the time counter by 100
        this.currentTime += 100;

        //If our current time is larger than the timeout
        if (1000 <= this.currentTime) {
          //Wait 500 miliseconds for the dom to catch up, then reset the snackbar
          setTimeout(() => {
            this.alert = false; //Update the alert to false
            this.cancelRequest();
            this.$emit("success");
            this.currentTime = 0; // reset the current time
          }, 500);
        } else {
          //Recursivly update the progress bar
          this.syncPbar();
        }
      }, 100);
    },
  },
};
</script>