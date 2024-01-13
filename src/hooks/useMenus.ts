import { computed } from "vue";
import { userStore } from "@/stores/user";

export const useMenus = () => {
  const user = userStore();

  const menus = computed(() => {
    const basic = [
      {
        name: "首页",
        icon: "mdi-home-outline",
        to: "/",
      },
      {
        name: "关于",
        icon: "mdi-information-outline",
        to: "about",
      },
    ];

    if (user.isAdmin)
      basic.push({
        name: "用户",
        icon: "mdi-account-circle-outline",
        to: "users",
      });

    return basic;
  });

  return {
    menus,
  };
};
