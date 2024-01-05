import { ref } from "vue";
import { defineStore } from "pinia";
export const indexStore = defineStore("indexStore", () => {
  const snackbar = ref({
    show: false,
    text: "",
    timeout: 2000,
    color: "",
    location: "top center",
  });

  const showMsg = (
    msg: string,
    timeout = 2000,
    color = "",
    location = "top center"
  ) => {
    snackbar.value = {
      show: true,
      text: msg,
      timeout,
      color,
      location,
    };
  };
  return {
    snackbar,
    showMsg,
  };
});
