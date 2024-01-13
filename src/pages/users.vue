<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-responsive class="fill-height">
      <v-text-field
        class="mt-2"
        v-model:model-value="search"
        label="搜索"
        clearable
        density="compact"
        variant="outlined"
        append-inner-icon="mdi-magnify"
        hide-details
      ></v-text-field>

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
        <template v-slot:item.role="{ item }">
          {{ UserPermission[item.role] }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ UserStatus[item.status] }}
        </template>
        <template v-slot:item.regTime="{ item }">
          {{ new Date(item.regTime).toLocaleString() }}
        </template>
        <template v-slot:item.operate="{ item }">
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
            v-if="isAdmin && item.email !== userInfo?.email"
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
                v-model:model-value="formData.name"
                readonly
                label="用户名"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model:model-value="formData.email"
                readonly
                label="邮箱"
                type="email"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model:model-value="formData.role"
                :disabled="userInfo?.email === formData.email"
                :items="SelectRoles"
                item-title="name"
                item-value="val"
                label="权限组"
                density="compact"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model:model-value="formData.status"
                :disabled="userInfo?.email === formData.email"
                :items="SelectStatus"
                item-title="name"
                item-value="val"
                label="状态"
                density="compact"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model:model-value="formData.regTime"
                readonly
                label="注册时间"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col> </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog.cancel">取消</v-btn>
        <v-btn color="primary" :loading="saveBtnLoading" @click="save"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteConfirmDialog" persistent width="500">
    <v-card color="red">
      <v-card-title> 警告 </v-card-title>
      <v-card-text>
        你真的要删除这个用户吗？ 删除后，该用户仍可通过 OAuth2
        平台进行登录。</v-card-text
      >
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
import type { UserInfo, NyaResponse, UserListRes } from "@/types";
import { indexStore } from "@/stores";
import { userStore } from "@/stores/user";
const { showMsg } = indexStore();
const { isAdmin, userInfo } = userStore();
const UserPermission: { [key: string]: string } = {
  default: "默认",
  admin: "管理员",
};
const UserStatus: { [key: string]: string } = {
  "-1": "封禁",
  "0": "正常",
};
const SelectRoles = [
  { name: "默认", val: "default" },
  { name: "管理员", val: "admin" },
];
const SelectStatus = [
  { name: "封禁", val: "-1" },
  { name: "正常", val: "0" },
];
const itemsPerPage = ref(10);
const headers = ref([
  { key: "id", title: "ID" },
  { key: "name", title: "用户名" },
  { key: "email", title: "邮箱" },
  { key: "role", title: "权限组" },
  { key: "status", title: "状态" },
  { key: "regTime", title: "注册时间" },
  { key: "operate", title: "操作", sortable: false },
]);
const search = ref("");
const serverItems = ref<UserInfo[]>();
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
      const { data }: { data: UserListRes } = await axios.get(
        "/v1/user/list/",
        {
          params: {
            page,
            pageSize: itemsPerPage,
            sortBy: sortBy.length > 0 ? sortBy[0].key : "id",
            sortDesc: sortBy.length > 0 ? sortBy[0].order === "desc" : false,
            search: search.value,
          },
        }
      );
      loading.value = false;
      serverItems.value = data.data.users;
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
const formData = ref<UserInfo>({
  id: 0,
  name: "",
  email: "",
  role: "",
  status: 0,
  regTime: new Date().toLocaleString(),
});

const reset = () => form.value.reset();

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
    const { data }: { data: NyaResponse } = await axios.put(
      `/v1/user/`,
      formData.value
    );
    showMsg(data.msg, "blue");
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

const edit = (item: UserInfo) => {
  formData.value = _.cloneDeep(item);
  formData.value.regTime = new Date(formData.value.regTime).toLocaleString();
  dialog.value.title = `编辑（${item.id}）`;
  dialog.value.show = true;
};

// 待优化
const deleteConfirmDialog = ref(false);
const delBtnLoading = ref(false);
const opeDeleteConfirmDialog = (item: UserInfo) => {
  formData.value = _.cloneDeep(item);
  deleteConfirmDialog.value = true;
};
const del = async () => {
  delBtnLoading.value = true;
  try {
    const { data }: { data: NyaResponse } = await axios.delete("/v1/user", {
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
