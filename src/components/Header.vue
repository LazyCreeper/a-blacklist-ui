<template>
  <v-app-bar flat>
    <v-container class="mx-auto d-flex align-center justify-center">
      <div class="mr-4 logo">
        <a href="javascript:;" class="text-decoration-none">A Blacklist</a>
      </div>
      <v-btn
        v-for="link in menus"
        :key="link.name"
        :text="link.name"
        variant="text"
        :to="link.to"
        class="mr-4"
        color="brown-darken-3 only-desktop"
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
import axios from "axios";
import md5 from "md5";
import { userStore } from "@/stores/user";
import { indexStore } from "@/stores";
import { useMenus } from "@/hooks/useMenus";
import type { UserInfoRes } from "@/types";
import { onMounted } from "vue";
import router from "@/router";
const { showMsg } = indexStore();
const user = userStore();
const { menus } = useMenus();

const toLogin = () => {
  window.location.href =
    "https://api.imlazy.ink/#/oauth2/authorize?client_id=12&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1238%2F#/oauth2/callback";
};

const login = async () => {
  try {
    const { data }: { data: UserInfoRes } = await axios.post(
      "/v1/oauth2/nyancy/user",
      {
        access_token: localStorage.token,
      }
    );
    user.userInfo = data.data;
    user.isLogin = true;
  } catch (err: any) {
    console.error(err);
    showMsg(err.response.data.msg || err.message, "red");
  }
};

onMounted(async () => {
  if (localStorage.getItem("token")) {
    if (router.currentRoute.value.query.code) return;
    showMsg("正在尝试自动登录...", "blue");
    await login();
  }
});
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
