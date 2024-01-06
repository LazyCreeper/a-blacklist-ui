<template>
  <v-app>
    <Header />
    <Drawer />
    <v-main>
      <router-view />
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script lang="ts" setup>
import Header from "./components/Header.vue";
import Snackbar from "./components/Snackbar.vue";
import Drawer from "./components/Drawer.vue";
</script>
