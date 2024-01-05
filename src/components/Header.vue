<template>
  <v-app-bar flat>
    <v-container class="mx-auto d-flex align-center justify-center">
      <div class="mr-4 logo">
        <a href="javascript:;" class="text-decoration-none">A Blacklist</a>
      </div>
      <v-btn
        v-for="link in links"
        :key="link.name"
        :text="link.name"
        variant="text"
        :to="link.to"
        class="mr-4"
        color="brown-darken-3"
      ></v-btn>

      <v-spacer></v-spacer>
      <div
        v-if="user.isLogin"
        class="d-flex align-center"
        style="cursor: pointer"
      >
        <div class="mr-4">{{ user.userInfo?.username }}</div>
        <v-avatar
          class="me-4"
          color="grey-darken-1"
          :image="`https://cdn.imlazy.ink:233/avatar/${md5(
            user.userInfo?.email ?? ''
          )}?s=100&r=R&d=`"
          size="32"
        ></v-avatar>
      </div>
      <div
        v-else
        class="d-flex align-center"
        style="cursor: pointer"
        @click="toLogin()"
      >
        <div class="mr-4">未登录</div>
        <v-avatar
          class="me-4"
          color="grey-darken-1"
          image="https://cdn.imlazy.ink:233/img/tup/20240104/aBlackList.png"
          size="32"
        ></v-avatar>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import md5 from "md5";
import { userStore } from "@/stores/user";
const user = userStore();
const links = [
  {
    name: "首页",
    to: "/",
  },
  {
    name: "关于",
    to: "about",
  },
];

const toLogin = () => {
  window.location.href =
    "https://api.imlazy.ink/#/oauth2/authorize?client_id=12&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1238%2F#/oauth2/callback";
};
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
