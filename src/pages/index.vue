<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-responsive class="fill-height">
      <div class="mt-2 d-flex align-center">
        <v-text-field
          v-model:model-value="search"
          class="mr-4"
          label="搜索"
          clearable
          density="compact"
          variant="outlined"
          append-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>
        <v-btn v-if="isAdmin" variant="outlined" color="primary" @click="add"
          >添加</v-btn
        >
      </div>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        :search="search"
        hover
        @update:options="loadItems"
      >
        <template v-slot:item.reason="{ item }">
          <span
            class="text-truncate"
            style="max-width: 20vmax; display: block"
            >{{ item.reason }}</span
          >
        </template>
        <template v-slot:item.addTime="{ item }">
          {{ new Date(item.addTime).toLocaleString() }}
        </template>
        <template v-slot:item.operate="{ item }">
          <v-btn
            class="mr-4"
            icon="mdi-information-outline"
            variant="text"
            size="small"
            @click="showInfo(item)"
          ></v-btn>
          <v-btn
            v-if="isAdmin"
            class="mr-4"
            icon="mdi-pencil-outline"
            variant="text"
            size="small"
            color="primary"
            @click="edit(item)"
          ></v-btn>
          <v-btn
            v-if="isAdmin"
            icon="mdi-trash-can-outline"
            variant="text"
            size="small"
            color="red"
            @click="edit(item)"
          ></v-btn>
        </template>
      </v-data-table-server>
    </v-responsive>
  </v-container>

  <v-dialog v-model="dialog.show" persistent width="500">
    <v-card>
      <v-card-title> {{ dialog.title }} </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-text-field
                v-model:model-value="formData.qq"
                :readonly="dialog.title === '详情信息'"
                label="QQ"
                type="number"
                :clearable="dialog.title !== '详情信息'"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model:model-value="formData.bilibili"
                :readonly="dialog.title === '详情信息'"
                label="B站 UID"
                :clearable="dialog.title !== '详情信息'"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model:model-value="formData.reason"
                :readonly="dialog.title === '详情信息'"
                label="原因"
                :clearable="dialog.title !== '详情信息'"
                density="compact"
                variant="outlined"
                :rules="[(v) => !!v || '请输入原因']"
                required
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="dialog.title !== '详情信息'" color="red" @click="reset"
          >重置</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn @click="dialog.cancel">取消</v-btn>
        <v-btn
          v-if="dialog.title !== '详情信息'"
          color="primary"
          :loading="saveBtnLoading"
          @click="save"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import _ from "lodash";
import type { BlacklistRes, Blacklist, NyaResponse } from "@/types";
import { indexStore } from "@/stores";
import { userStore } from "@/stores/user";
const { showMsg } = indexStore();
const { isAdmin } = userStore();
const itemsPerPage = ref(10);
const headers = ref([
  { key: "id", title: "ID" },
  { key: "qq", title: "QQ" },
  { key: "reason", title: "原因" },
  { key: "addTime", title: "添加时间" },
  { key: "operate", title: "操作", sortable: false },
]);
const search = ref("");
const serverItems = ref<Blacklist[]>([]);
const loading = ref(false);
const totalItems = ref(10);
const currentPage = ref(1);
const _sortBy = ref<Array<{ key: string; order: string }>>([
  { key: "id", order: "asc" },
]);

const loadItems = _.throttle(
  async ({
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
      currentPage.value = page;
      _sortBy.value = sortBy;
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
    } catch (err: any) {
      loading.value = false;
      showMsg(err.response.data.msg || err.message);
      console.error(err);
    }
  },
  1000
);

const form = ref();
const formData = ref<Blacklist>({
  id: 0,
  qq: "",
  bilibili: "",
  reason: "",
  addTime: "",
});

const reset = () => {
  form.value.reset();
};

const dialog = ref({
  show: false,
  title: "添加",
  text: "",
  cancel: () => {
    dialog.value.show = false;
    reset();
  },
});

const saveBtnLoading = ref(false);
const save = async () => {
  saveBtnLoading.value = true;
  const { valid } = await form.value.validate();
  if (!valid) {
    showMsg("请检查表单完整", "red");
    saveBtnLoading.value = false;
    return;
  }
  try {
    if (dialog.value.title === "添加") {
      const { data }: { data: NyaResponse } = await axios.post(
        "/v1",
        formData.value
      );
      showMsg(data.msg, "green");
    } else {
      const { data }: { data: NyaResponse } = await axios.put(
        `/v1`,
        formData.value
      );
      showMsg(data.msg, "blue");
    }
  } catch (err: any) {
    console.error(err);
    showMsg(err.response.data.msg || err.message, "red");
    return;
  } finally {
    saveBtnLoading.value = false;
    dialog.value.cancel();
    loadItems({
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: _sortBy.value,
    });
  }
};

const showInfo = (item: Blacklist) => {
  formData.value = _.cloneDeep(item);
  dialog.value.title = "详情信息";
  dialog.value.show = true;
};

const edit = (item: Blacklist) => {
  formData.value = _.cloneDeep(item);
  dialog.value.title = `编辑（${item.id}）`;
  dialog.value.show = true;
};

const add = () => {
  dialog.value.title = `添加`;
  dialog.value.show = true;
};
</script>
