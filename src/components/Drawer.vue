<template>
  <v-navigation-drawer v-model="store.drawer" temporary>
    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menus"
        :key="item.name"
        :prepend-icon="item.icon"
        :title="item.name"
        :to="item.to"
      ></v-list-item>
      <v-list-item>
        <template #subtitle>
          版权所有 © {{ new Date().getFullYear() }} Lazy 保留所有权利
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <div
    class="toggleMenu only-phone"
    @click.stop="store.drawer = !store.drawer"
  ></div>
</template>

<script lang="ts" setup>
import { indexStore } from "@/stores";
import { useMenus } from "@/hooks/useMenus";
const store = indexStore();
const { menus } = useMenus();
</script>
