<template>
  <v-container>
    <v-responsive class="align-center fill-height">
      <v-row>
        <v-col>
          <v-card color="black">
            <v-card-title class="d-flex align-center"
              ><v-icon class="mr-2" icon="mdi-github" size="small"></v-icon>
              开源地址
            </v-card-title>
            <v-card-text>
              <ul>
                <ol>
                  后端：<a
                    class="aLink"
                    href="https://github.com/LazyCreeper/a-blacklist"
                    target="_blank"
                    >https://github.com/LazyCreeper/a-blacklist</a
                  >
                </ol>
                <ol>
                  前端：<a
                    class="aLink"
                    href="https://github.com/LazyCreeper/a-blacklist-ui"
                    target="_blank"
                    >https://github.com/LazyCreeper/a-blacklist-ui</a
                  >
                </ol>
                <ol>
                  Copyright ©
                  {{
                    new Date().getFullYear()
                  }}
                  Lazy All Rights Reserved.
                </ol>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="green">
            <v-card-title class="d-flex align-center"
              ><v-icon class="mr-2" icon="mdi-rice"></v-icon> 要饭
            </v-card-title>
            <v-card-text>
              <v-img
                cover
                src="https://cdn.imlazy.ink:233/img/20220924.jpg"
              ></v-img>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
