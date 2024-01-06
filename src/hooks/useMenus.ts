import { computed } from "vue";

export const useMenus = () => {
  const menus = computed(() => [
    {
      name: "首页",
      icon: "mdi-home",
      to: "/",
    },
    {
      name: "关于",
      icon: "mdi-information",
      to: "about",
    },
  ]);

  return {
    menus,
  };
};
