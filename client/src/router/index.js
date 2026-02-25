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
import SellerSalesDetail from '../views/owner/Detail/SellerSalesDetail.vue'; // សូមកែតម្រូវទីតាំង Path តាមជាក់ស្ដែង

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
        {
          path: 'owner/admin-detail/:id',
          name: 'OwnerAdminDetail',
          component: () => import('../views/owner/AdminDetail.vue'),
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
          path: 'admin/seller-reports', 
          name: 'seller-reports',
          component: SellerReports 
        },
        {
  path: '/seller/:id/detail',
  name: 'SellerSalesDetail', // ឈ្មោះនេះត្រូវតែត្រឹមត្រូវ ព្រោះក្នុង AdminDetail.vue យើងហៅឈ្មោះនេះ
  component: SellerSalesDetail,
  meta: { requiresAuth: true } // បើប្រព័ន្ធអ្នកមានតម្រូវការ Login
}
        // បានលុប Route ប្រវត្តិលក់លម្អិតចេញពីទីនេះរួចរាល់
      ]
    }
  ]
})

export default router