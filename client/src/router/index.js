import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../views/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'

// Owner Views
import OwnerDashboard from '../views/owner/Dashboard.vue'
import ManageAdmins from '../views/owner/ManageAdmins.vue'
import OwnerReports from '../views/owner/OwnerReports.vue'
import OwnerSettings from '../views/owner/OwnerSettings.vue' // <--- NEW IMPORT
import TrashAdmins from '../views/owner/TrashAdmins.vue'

// Admin Views
import AdminDashboard from '../views/admin/Dashboard.vue'
import ManageSellers from '../views/admin/ManageSellers.vue'
import InputSales from '../views/admin/InputSales.vue' 

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/app',
      component: MainLayout,
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
        {
          path: 'owner/reports',
          name: 'owner-reports',
          component: OwnerReports
        },
        {
          path: 'owner/settings', // <--- NEW ROUTE
          name: 'owner-settings',
          component: OwnerSettings
        },
        {
          path: 'owner/trash',
          name: 'trash-admins',
          component: TrashAdmins
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
        {
          path: 'admin/sales',
          name: 'input-sales',
          component: InputSales
        },
        { 
          path: 'admin/seller-sales/:id', 
          component: () => import('../views/admin/SellerSalesHistory.vue'),
          props: true 
        },
        { 
          path: 'admin/seller-reports', 
          component: () => import('../views/admin/SellerReports.vue') 
        }
      ]
    }
  ]
})

export default router