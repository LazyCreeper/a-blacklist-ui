<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script lang="ts" setup>
import Header from "./components/Header.vue";
import Snackbar from "./components/Snackbar.vue";
</script>
