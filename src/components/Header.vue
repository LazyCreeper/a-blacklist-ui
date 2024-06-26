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
        class="mr-4 only-desktop"
      ></v-btn>

      <v-spacer></v-spacer>
      <DarkModeSwitcher class="mr-4" />
      <v-menu v-if="isLogin">
        <template v-slot:activator="{ props }">
          <div
            v-ripple
            v-bind="props"
            class="d-flex align-center"
            style="cursor: pointer"
          >
            <div class="mr-4">{{ userInfo?.name }}</div>
            <v-avatar
              class="me-4"
              color="grey-darken-1"
              :image="`https://cdn.imlazy.ink:233/avatar/${md5(
                userInfo?.email ?? ''
              )}?s=100&r=R&d=`"
              size="32"
            ></v-avatar>
          </div>
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-exit-to-app"
            title="退出登录"
            @click="logout"
          >
          </v-list-item>
        </v-list>
      </v-menu>

      <div
        v-else
        class="d-flex align-center"
        style="cursor: pointer"
        v-ripple
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
import { storeToRefs } from "pinia";
import { useMenus } from "@/hooks/useMenus";
import type { NyaResponse, UserInfoRes } from "@/types";
import { onMounted } from "vue";
import DarkModeSwitcher from "./DarkModeSwitcher.vue";
const { showMsg } = indexStore();
const { userInfo, isLogin } = storeToRefs(userStore());
const { menus } = useMenus();

const toLogin = async () => {
  try {
    const { data }: { data: NyaResponse } = await axios.get(
      "/v1/oauth2/nyancy/?t=" + Date.now()
    );
    window.location.href = data.data.url;
  } catch (err: any) {
    console.error(err);
    showMsg(err.response?.data.msg || err.message, "red");
  }
};

const login = async () => {
  try {
    const { data }: { data: UserInfoRes } = await axios.post(
      "/v1/oauth2/nyancy/user/?t=" + Date.now(),
      {
        access_token: localStorage.token,
      }
    );
    userInfo.value = data.data;
    isLogin.value = true;
  } catch (err: any) {
    console.error(err);
    showMsg(err.response.data.msg || err.message, "red");
    // 额，，预留优化空间
    if (err.response.data.msg.includes("被封禁")) {
      localStorage.removeItem("token");
    }
  }
};

const logout = async () => {
  localStorage.removeItem("token");
  window.location.reload();
};

onMounted(async () => {
  if (localStorage.getItem("token")) {
    if (location.hash.includes("code=")) return;
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
