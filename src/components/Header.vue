<template>
  <v-app-bar flat>
    <v-container class="mx-auto d-flex align-center justify-center">
      <div class="mr-4 logo">
        <a href="javascript:;" class="text-decoration-none">A Blacklist</a>
      </div>
      <v-btn
        v-for="link in links"
        :key="link"
        :text="link"
        variant="text"
        :to="link"
        class="mr-4"
      ></v-btn>

      <v-spacer></v-spacer>
      <v-avatar
        class="me-4"
        color="grey-darken-1"
        image="https://cdn.imlazy.ink:233/img/tup/20240104/aBlackList.png"
        size="32"
      ></v-avatar>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
const links = ["/", "test"];
</script>

<style lang="scss" scoped>
.logo {
  a {
    color: unset;
    text-shadow: 6px -4px 15px #e20c7d, -7px 7px 15px #fd3535;
    font-weight: 500;
  }
}
</style>
