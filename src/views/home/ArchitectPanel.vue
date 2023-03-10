<template >
  <section>
    <v-row>
      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData">
          <v-card-title primary-title>
            Solicitações de Serviços

            <v-spacer></v-spacer>
            <v-btn color="#CE9D6B" icon @click="$emit('updateServicesDate')">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                v-for="(service, index) in services"
                :key="index"
                v-show="service.status == 0"
              >
                <v-card class="service-card" color="#E4E6E6">
                  <v-card-title primary-title>
                    {{ service.title }}
                  </v-card-title>
                  <v-card-subtitle primary-title>
                    Solicitante - {{ capitalize(service.requester) }}
                    <br />
                    <v-chip color="#187c9b79" small dark>
                      {{ getStatus(service.status) }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text> {{ service.description }} </v-card-text>
                  <v-card-actions class="actions">
                    <v-row>
                      <v-col>
                        <v-btn
                          color="#9b181879"
                          block
                          dark
                          @click="changeServiceStatus(2, service.id)"
                        >
                          Rejeitar
                        </v-btn>
                      </v-col>
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
                          @click="changeServiceStatus(1, service.id)"
                        >
                          Aceitar
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
      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData">
          <v-card-title primary-title>
            Serviços Excluidos

            <v-spacer></v-spacer>
            <v-btn color="#CE9D6B" icon @click="$emit('updateServicesDate')">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                v-for="(service, index) in services"
                :key="index"
                v-show="service.status == 3"
              >
                <v-card class="service-card" color="#E4E6E6">
                  <v-card-title primary-title>
                    {{ service.title }}
                  </v-card-title>
                  <v-card-subtitle primary-title>
                    Solicitante - {{ capitalize(service.requester) }}
                    <br />
                    <v-chip color="#7a7a7a79" small dark>
                      {{ getStatus(service.status) }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text> {{ service.description }} </v-card-text>
                  <v-card-actions class="actions">
                    <v-row>
                      <v-col>
                        <v-btn
                          color="#CE9D6B"
                          block
                          dark
                          @click="changeServiceStatus(0, service.id)"
                          >Restaurar</v-btn
                        >
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
    <v-row>
      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData">
          <v-card-title primary-title>
            Serviços Aceitos

            <v-spacer></v-spacer>
            <v-btn color="#CE9D6B" icon @click="$emit('updateServicesDate')">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                v-for="(service, index) in services"
                :key="index"
                v-show="service.status == 1"
              >
                <v-card class="service-card" color="#E4E6E6">
                  <v-card-title primary-title>
                    {{ service.title }}
                  </v-card-title>
                  <v-card-subtitle primary-title>
                    Solicitante - {{ capitalize(service.requester) }}
                    <br />
                    <v-chip color="#189b1879" small dark>
                      {{ getStatus(service.status) }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text> {{ service.description }} </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" lg="6" sm="12">
        <v-card elevation="0" :loading="loadingData">
          <v-card-title primary-title>
            Serviços Recusados

            <v-spacer></v-spacer>
            <v-btn color="#CE9D6B" icon @click="$emit('updateServicesDate')">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                v-for="(service, index) in services"
                :key="index"
                v-show="service.status == 2"
              >
                <v-card class="service-card" color="#E4E6E6">
                  <v-card-title primary-title>
                    {{ service.title }}
                  </v-card-title>
                  <v-card-subtitle primary-title>
                    Solicitante - {{ capitalize(service.requester) }}
                    <br />
                    <v-chip color="#9b181879" small dark>
                      {{ getStatus(service.status) }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text> {{ service.description }} </v-card-text>
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
import capitalizeName from "../../plugins/capitalize";
import axiosInstance from "../../plugins/axiosInstance";

export default {
  props: {
    services: Array,
    loadingData: Boolean,
  },

  methods: {
    capitalize(name) {
      return capitalizeName(name);
    },

    changeServiceStatus(status, id) {
      this.$emit("loadingData");
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
            this.$emit("updateServicesDate");
          }
          this.loading = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.loading = false;
        });
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
  },
};
</script>