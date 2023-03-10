<template>
  <section>
    <v-row>
      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData || loadingServices">
          <v-card-title primary-title>
            Arquitetos disponiveis para serviços
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                md="6"
                sm="12"
                v-for="(architect, index) in architects"
                :key="index"
              >
                <v-card class="architect-card" color="#E4E6E6" height="250">
                  <v-card-title primary-title>
                    {{ capitalizeArchitectName(architect.name) }}
                  </v-card-title>
                  <v-card-text>
                    E-mail: {{ architect.email }} <br />
                    Telefone: {{ architect.phone }}
                  </v-card-text>
                  <v-card-actions class="actions">
                    <v-row>
                      <v-col>
                        <v-dialog
                          v-model="requestServiceActive"
                          width="600"
                          :retain-focus="false"
                          persistent
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="#CE9D6B"
                              dark
                              block
                              v-bind="attrs"
                              v-on="on"
                            >
                              Solicitar Serviço
                            </v-btn>
                          </template>
                          <RequestService
                            v-if="requestServiceActive"
                            :architect="architect"
                            :user="user"
                            :edit="editService"
                            @closeDialog="
                              requestServiceActive = false;
                              editServiceReset();
                            "
                            @success="getServices()"
                          ></RequestService>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData || loadingServices">
          <v-card-title primary-title>
            Serviços solicitados
            <v-spacer></v-spacer>
            <v-btn color="#CE9D6B" icon @click="getServices()">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                md="6"
                sm="12"
                v-for="(service, index) in services"
                :key="index"
              >
                <v-card class="architect-card" color="#E4E6E6" height="490">
                  <v-card-title primary-title>
                    {{ service.title }}
                  </v-card-title>
                  <v-card-subtitle primary-title>
                    <h4>Arquiteto</h4>
                    {{ capitalizeArchitectName(service.architectName) }}
                    <br />
                    <h4>status</h4>
                    <v-chip :color="getStatusColor(service.status)" small dark>
                      {{ getStatus(service.status) }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text :style="descriptionSize(service.description, 22)">
                    {{ service.description }}
                  </v-card-text>
                  <v-card-actions class="actions" v-show="service.status == 0">
                    <v-row>
                      <v-col>
                        <v-btn
                          color="#5D6460"
                          block
                          dark
                          @click="changeServiceStatus(3, service.id)"
                        >
                          Excluir
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          color="#CE9D6B"
                          block
                          dark
                          @click="prepareToEdit(service)"
                        >
                          Editar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>
<script>
import RequestService from "../shared/RequestService.vue";
import capitalizeName from "../../plugins/capitalize";
import axiosInstance from "../../plugins/axiosInstance";

export default {
  data() {
    return {
      requestServiceActive: false,
      loadingServices: false,
      services: [],
      editService: {
        id: null,
        title: "",
        description: "",
        active: false,
      },
    };
  },

  components: {
    RequestService,
  },

  props: {
    architects: Array,
    user: Object,
    loadingData: Boolean,
  },

  watch: {
    user() {
      if (this.services.length < 1) {
        this.getServices();
      }
    },
  },

  methods: {
    capitalizeArchitectName(name) {
      return capitalizeName(name);
    },

    prepareToEdit(service) {
      this.editService.title = service.title;
      this.editService.description = service.description;
      this.editService.active = true;
      this.editService.id = service.id;
      this.requestServiceActive = true;
    },

    editServiceReset() {
      this.editService.active = false
    },

    async getServices() {
      this.loadingServices = true;
      await axiosInstance
        .get(`/services/byclientid/${this.user.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // faça algo com a resposta
          if (response.status == 200) {
            this.services = response.data.services;
            this.services.sort((a, b) => a.status - b.status);
            this.loadingServices = false;
          }
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.loadingServices = false;
        });
    },

    changeServiceStatus(status, id) {
      axiosInstance
        .put(
          "/services",
          {
            status: status,
            id: id,
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
            this.getServices();
          }
          this.loading = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.loading = false;
        });
    },

    descriptionSize(description, maxSize) {
      return ` fontSize: ${maxSize - description.length / 23}px `;
    },

    getStatus(status) {
      switch (status) {
        case 0:
          return "Pendente";
        case 1:
          return "Aceito";
        case 2:
          return "Recusado";
        case 3:
          return "Excluido";
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 0:
          return "#187c9b79";
        case 1:
          return "#189b1879";
        case 2:
          return "#9b181879";
        case 3:
          return "#7a7a7a79";
      }
    },
  },
};
</script>