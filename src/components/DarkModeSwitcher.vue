<template>
  <v-btn
    @click="toggleDarkMode"
    :icon="store.isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny'"
  >
  </v-btn>
</template>

<script setup lang="ts">
import { indexStore } from "@/stores";
import { useTheme } from "vuetify";

const theme = useTheme();
const store = indexStore();

if (
  store.isDarkMode &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  theme.global.name.value = "dark";
} else {
  theme.global.name.value = "light";
}

const toggleDarkMode = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  store.isDarkMode = theme.global.current.value.dark;
};
</script>
