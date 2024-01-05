<template>
  <v-container>
    <v-responsive class="align-center text-center fill-height">
      <div style="width: 50%; margin: 15% auto">
        <v-progress-linear
          class="mb-4"
          :indeterminate="isLoading"
          :model-value="isLoading ? 0 : 100"
        ></v-progress-linear>
        <p v-if="isLoading">正在验证数据...</p>
        <p v-else>登陆成功，正在重定向...</p>
      </div>
    </v-responsive>
  </v-container>
  <v-dialog v-model="dialog.show" persistent width="500">
    <v-card color="red">
      <v-card-title> 错误 </v-card-title>
      <v-card-text>
        {{ dialog.text }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="black" block @click="dialog.cancel">返回首页</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { indexStore } from "@/stores";
import { userStore } from "@/stores/user";
import router from "@/router";
import type { UserInfoRes } from "@/types";
import axios from "axios";

const user = userStore();
const { showMsg } = indexStore();
const code = useRouteQuery("code");
const state = useRouteQuery("state");
const isLoading = ref(true);
const dialog = ref({
  show: false,
  text: "",
  cancel: () => {
    dialog.value.show = false;
  },
});
const redirect = async () => {
  try {
    const { data }: { data: UserInfoRes } = await axios.post(
      "/v1/oauth2/nyancy",
      {
        code: code.value,
        state: state.value,
      }
    );

    user.userInfo = data.data;
    user.isLogin = true;
    isLoading.value = false;
    showMsg("登录成功");
    setTimeout(() => {
      router.replace("/");
    }, 233);
  } catch (err: any) {
    console.error(err);
    dialog.value.text = err.response.data.msg || err.message;
    dialog.value.show = true;
  }
};

onMounted(async () => {
  await redirect();
});
</script>
