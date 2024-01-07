<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-responsive class="fill-height">
      <div class="mt-2 d-flex align-center">
        <v-text-field
          v-model:model-value="search"
          label="搜索"
          clearable
          density="compact"
          variant="outlined"
          append-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>
        <v-btn
          v-if="isAdmin"
          class="ml-4"
          variant="outlined"
          color="primary"
          @click="add"
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
        color="transparent"
        @update:options="loadItems"
      >
        <template v-slot:item.reason="{ item }">
          <span
            class="text-truncate"
            style="max-width: 20vmax; display: block"
            >{{ item.reason }}</span
          >
        </template>
        <template v-slot:item.violateTime="{ item }">
          {{ new Date(item.violateTime).toLocaleString() }}
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
            @click="opeDeleteConfirmDialog(item)"
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
              <v-text-field
                v-model:model-value="formData.violateTime"
                :readonly="dialog.title === '详情信息'"
                label="违法时间"
                :clearable="dialog.title !== '详情信息'"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model:model-value="formData.updateAt"
                :readonly="dialog.title === '详情信息'"
                label="最后更新"
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

  <v-dialog v-model="deleteConfirmDialog" persistent width="500">
    <v-card color="red">
      <v-card-title> 警告 </v-card-title>
      <v-card-text> 你真的要删除这条吗？ </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="deleteConfirmDialog = false">取消</v-btn>
        <v-btn color="black" :loading="delBtnLoading" @click="del">确定</v-btn>
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
  { key: "violateTime", title: "违法时间" },
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
      const { data }: { data: BlacklistRes } = await axios.get("/v1/", {
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
  violateTime: new Date().toLocaleString(),
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
        "/v1/",
        formData.value
      );
      showMsg(data.msg, "green");
    } else {
      const { data }: { data: NyaResponse } = await axios.put(
        `/v1/`,
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
  formData.value.violateTime = new Date(
    formData.value.violateTime
  ).toLocaleString();
  formData.value.updateAt = new Date(formData.value.updateAt).toLocaleString();
  dialog.value.title = "详情信息";
  dialog.value.show = true;
};

const edit = (item: Blacklist) => {
  formData.value = _.cloneDeep(item);
  formData.value.violateTime = new Date(
    formData.value.violateTime
  ).toLocaleString();
  formData.value.updateAt = new Date(formData.value.updateAt).toLocaleString();
  dialog.value.title = `编辑（${item.id}）`;
  dialog.value.show = true;
};

const add = () => {
  if (form.value) reset();
  dialog.value.title = "添加";
  dialog.value.show = true;
};

// 待优化
const deleteConfirmDialog = ref(false);
const delBtnLoading = ref(false);
const opeDeleteConfirmDialog = (item: Blacklist) => {
  formData.value = _.cloneDeep(item);
  deleteConfirmDialog.value = true;
};
const del = async () => {
  delBtnLoading.value = true;
  try {
    const { data }: { data: NyaResponse } = await axios.delete("/v1/", {
      data: {
        id: formData.value.id,
      },
    });
    showMsg(data.msg, "green");
  } catch (err: any) {
    console.error(err);
    showMsg(err.response.data.msg || err.message, "red");
  } finally {
    deleteConfirmDialog.value = delBtnLoading.value = false;
    loadItems({
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: _sortBy.value,
    });
  }
};
</script>
