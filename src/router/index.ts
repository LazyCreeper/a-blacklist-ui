/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from "vue-router/auto";

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
});

export default router;
