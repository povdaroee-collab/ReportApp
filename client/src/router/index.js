import { createRouter, createWebHistory } from 'vue-router'

// 1. Import Login
import Login from '../views/Login.vue'

// 2. Import Layout
import MainLayout from '../layouts/MainLayout.vue'

// 3. Import Owner Views
import OwnerDashboard from '../views/owner/Dashboard.vue'
import ManageAdmins from '../views/owner/ManageAdmins.vue'

// 4. Import Admin Views
import AdminDashboard from '../views/admin/Dashboard.vue'
import ManageSellers from '../views/admin/ManageSellers.vue'
import InputSales from '../views/admin/InputSales.vue' // <--- NEW IMPORT

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/app',
      component: MainLayout,
      // All app pages are children of MainLayout
      children: [
        // --- OWNER ROUTES ---
        {
          path: 'owner/dashboard',
          name: 'owner-dashboard',
          component: OwnerDashboard
        },
        {
          path: 'owner/admins',
          name: 'manage-admins',
          component: ManageAdmins
        },

        // --- ADMIN ROUTES ---
        {
          path: 'admin/dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard
        },
        {
          path: 'admin/sellers',
          name: 'manage-sellers',
          component: ManageSellers
        },
        // --- NEW ROUTE: INPUT SALES ---
        {
          path: 'admin/sales',
          name: 'input-sales',
          component: InputSales
        }
      ]
    }
  ]
})

export default router