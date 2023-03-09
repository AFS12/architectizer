<template>
  <v-card width="450px" class="register-card" outlined elevation="4">
    <v-card-title primary-title> Nova conta </v-card-title>
    <v-card-subtitle>
      Preencha os campos abaixo para criar uma nova conta
    </v-card-subtitle>
    <v-card-text class="register-form">
      <v-form ref="form" lazy-validation>
        <v-select
          v-model="registerForm.type"
          :rules="[rules.required]"
          :items="types"
          item-text="text"
          item-value="id"
          outlined
          label="Arquiteto ou Cliente"
          dense
          color="#CE9D6B"
        />
        <v-text-field
          v-model="registerForm.name"
          :rules="[rules.required]"
          outlined
          label="Nome"
          dense
          color="#CE9D6B"
        />
        <v-text-field
          v-model="registerForm.email"
          :rules="[rules.required, rules.email]"
          outlined
          label="E-mail"
          dense
          color="#CE9D6B"
        />
        <v-text-field
          v-model="registerForm.password"
          :rules="[rules.required, rules.password]"
          outlined
          label="Senha"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          dense
          color="#CE9D6B"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          v-model="registerForm.phone"
          :rules="[rules.required, rules.phone]"
          outlined
          label="Telefone"
          v-mask="'(##) #####-####'"
          dense
          color="#CE9D6B"
        />
        <v-row>
          <v-col>
            <v-select
              v-model="registerForm.gender"
              :rules="[rules.required]"
              :items="genders"
              item-text="text"
              item-value="id"
              outlined
              label="Gênero"
              dense
              color="#CE9D6B"
            />
          </v-col>
          <v-col>
            <v-text-field
              outlined
              v-model="registerForm.age"
              :rules="[rules.required]"
              label="Idade"
              type="number"
              max="120"
              min="0"
              dense
              color="#CE9D6B"
              @change="verifyValue(registerForm.age)"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="create-account-btn">
      <v-row>
        <v-col>
          <v-btn
            color="#CE9D6B"
            dark
            block
            elevation="0"
            text
            class="back-btn"
            @click="$emit('to-login')"
          >
            <strong> Voltar para login </strong>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="#CE9D6B"
            dark
            block
            elevation="1"
            class="register-btn"
            @click="formIsValid()"
            :loading="creating"
          >
            <strong> Criar conta </strong>
          </v-btn>
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
      creating: false,
      showPassword: false,
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        email: (value) => {
          if (!value) return "Email é obrigatório";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Email inválido";
          return true;
        },
        phone: (value) => {
          if (!value) return "Telefone é obrigatório";
          const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
          if (!phoneRegex.test(value)) return "Telefone inválido";
          return true;
        },
        password: (value) => {
          if (value) {
            if (value.length > 7) {
              return true;
            } else {
              return "A senha deve ter pelo menos 8 caracteres";
            }
          } else {
            return true;
          }
        },
      },
      genders: [
        {
          text: "Homem",
          id: "0",
        },
        {
          text: "Mulher",
          id: "1",
        },
        {
          text: "Outro",
          id: "3",
        },
      ],
      types: [
        {
          text: "Cliente",
          id: "0",
        },
        {
          text: "Arquiteto",
          id: "1",
        },
      ],
      registerForm: {
        gender: null,
        age: null,
        email: null,
        phone: null,
        name: null,
        password: null,
        type: null,
      },
    };
  },

  computed: {},

  methods: {
    verifyValue(age) {
      if (age > 120) {
        this.registerForm.age = 120;
      } else if (age < 0) {
        this.registerForm.age = 0;
      }
    },

    formIsValid() {
      if (this.$refs.form.validate()) {
        this.createUser();
      }
    },

    createUser() {
      this.creating = true;
      axiosInstance
        .post(
          "/users",
          {
            name: this.registerForm.name,
            email: this.registerForm.email,
            password: this.registerForm.password,
            phone: this.registerForm.phone,
            gender: this.registerForm.gender,
            age: this.registerForm.age,
            type: this.registerForm.type,
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
            this.$emit("created");
          }
          this.creating = false;
        })
        .catch((error) => {
          // trate o erro
          console.log(error);
          this.creating = false;
        });
    },
  },
};
</script>