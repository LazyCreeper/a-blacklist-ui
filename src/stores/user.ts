import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { UserInfo } from "@/types";
export const userStore = defineStore("userStore", () => {
  const isLogin = ref(false);

  const userInfo = ref<UserInfo>();

  const isAdmin = computed(() => userInfo.value?.role === "admin");
  return {
    isLogin,
    userInfo,
    isAdmin,
  };
});
