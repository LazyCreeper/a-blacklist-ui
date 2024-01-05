<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-responsive class="fill-height">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        :search="search"
        @update:options="loadItems"
      >
        <template v-slot:item.addTime="{ item }">
          {{ new Date(item.addTime).toLocaleString() }}
        </template>
      </v-data-table-server>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import type { BlacklistRes, Blacklist } from "@/types";

const itemsPerPage = ref(5);
const headers = ref([
  { key: "id", title: "ID" },
  { key: "qq", title: "QQ" },
  { key: "reason", title: "原因" },
  { key: "addTime", title: "添加时间" },
]);
const search = ref("");
const serverItems = ref<Blacklist[]>([]);
const loading = ref(false);
const totalItems = ref(10);
const loadItems = async ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: Array<{ key: string; order: string }>;
}) => {
  try {
    loading.value = true;
    const { data }: { data: BlacklistRes } = await axios.get("/v1", {
      params: {
        page,
        pageSize: itemsPerPage,
        sortBy: sortBy.length > 0 ? sortBy[0].key : "id",
        sortDesc: sortBy.length > 0 ? sortBy[0].order === "desc" : false,
        search: search.value,
      },
    });
    loading.value = false;
    serverItems.value = data.data.peoples;
    totalItems.value = data.data.totalCount;
  } catch (err) {
    loading.value = false;
    console.error(err);
  }
};
</script>
