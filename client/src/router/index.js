import { createRouter, createWebHashHistory } from 'vue-router'

// 1. Import Views
import Login from '../views/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'

// --- Owner Views ---
import OwnerDashboard from '../views/owner/Dashboard.vue'
import ManageAdmins from '../views/owner/ManageAdmins.vue'
import OwnerReports from '../views/owner/OwnerReports.vue'
import OwnerSettings from '../views/owner/OwnerSettings.vue' 
import TrashAdmins from '../views/owner/TrashAdmins.vue'
import StockManagement from '../views/owner/StockManagement.vue'

// --- Admin Views ---
import AdminDashboard from '../views/admin/Dashboard.vue'
import ManageSellers from '../views/admin/ManageSellers.vue'
import InputSales from '../views/admin/InputSales.vue' 
import SellerReports from '../views/admin/SellerReports.vue'
import SellerSalesDetail from '../views/admin/SellerSalesDetail.vue'
import SellerSalesHistory from '../views/admin/SellerSalesHistory.vue'

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
        // ===========================
        //       OWNER ROUTES
        // ===========================
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
          path: 'owner/stock-management', 
          name: 'StockManagement',
          component: StockManagement
        },
        {
          path: 'owner/settings', 
          name: 'owner-settings',
          component: OwnerSettings
        },
        {
          path: 'owner/trash',
          name: 'trash-admins',
          component: TrashAdmins
        },
        // ✅ កំណត់ Route សម្រាប់ AdminDetail ឱ្យត្រឹមត្រូវ
        {
          path: 'owner/admin-detail/:id',
          name: 'OwnerAdminDetail',
          component: () => import('../views/owner/AdminDetail.vue'), // ត្រូវប្រាកដថាមាន file នេះ
          meta: { requiresAuth: true, role: 'owner' },
          props: true
        },

        // ===========================
        //       ADMIN ROUTES
        // ===========================
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
          name: 'seller-sales-history',
          component: SellerSalesHistory,
          props: true 
        },
        { 
          path: 'admin/seller-reports', 
          name: 'seller-reports',
          component: SellerReports 
        },
        {
          path: 'admin/seller-detail/:id',
          name: 'SellerSalesDetail',
          component: SellerSalesDetail,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

export default router