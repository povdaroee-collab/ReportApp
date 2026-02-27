import { createRouter, createWebHashHistory } from "vue-router";
// សន្មតថាបងមាន Store ឬកន្លែងណាមួយសម្រាប់ទាញយក Role របស់ User (ឧទាហរណ៍ ប្រើ Firebase Auth & Firestore)
import { auth } from "../firebaseConfig"; // ដូរទៅតាម path ជាក់ស្តែងរបស់បង
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 1. Import Views
import Login from "../views/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";

// --- Owner Views ---
import OwnerDashboard from "../views/owner/Dashboard.vue";
import ManageAdmins from "../views/owner/ManageAdmins.vue";
import OwnerReports from "../views/owner/OwnerReports.vue";
import OwnerSettings from "../views/owner/OwnerSettings.vue";
import TrashAdmins from "../views/owner/TrashAdmins.vue";
import AccountMain from "../views/owner/account/AccountMain.vue";
import StockMain from "../views/owner/stock/StockMain.vue";
import SellerSalesDetail from "../views/owner/Detail/SellerSalesDetail.vue";

// --- Admin Views ---
import AdminDashboard from "../views/admin/Dashboard.vue";
import ManageSellers from "../views/admin/ManageSellers.vue";
import InputSales from '../views/admin/InputSales/InputSalesMain.vue';
import SellerReports from "../views/admin/SellerReports.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/app",
      component: MainLayout,
      meta: { requiresAuth: true }, // តម្រូវអោយ Login សម្រាប់កូនៗទាំងអស់
      children: [
        // ===========================
        //       OWNER ROUTES
        // ===========================
        {
          path: "owner/dashboard",
          name: "owner-dashboard",
          component: OwnerDashboard,
          meta: { roles: ["superadmin", "owner"] } // ទាំងពីរអាចចូលបាន
        },
        {
          path: "owner/admins",
          name: "manage-admins",
          component: ManageAdmins,
          meta: { roles: ["superadmin", "owner"] }
        },
        {
          path: "owner/reports",
          name: "owner-reports",
          component: OwnerReports,
          meta: { roles: ["superadmin", "owner"] }
        },
        {
          path: "owner/stock-management", // Route នេះដូចជាជាន់គ្នាជាមួយខាងក្រោម សូមពិនិត្យមើលផង
          name: "StockManagement",
          component: StockMain, // ដូរតាមការ import ថ្មី
          meta: { roles: ["superadmin", "owner"] }
        },
        {
          path: "owner/settings",
          name: "owner-settings",
          component: OwnerSettings,
          // ត្រង់នេះសំខាន់! អនុញ្ញាតឲ្យតែ superadmin ប៉ុណ្ណោះ
          meta: { roles: ["superadmin", "owner"] } 
        },
        {
          path: "owner/trash",
          name: "trash-admins",
          component: TrashAdmins,
          meta: { roles: ["superadmin", "owner"] }
        },
        {
          path: "owner/admin-detail/:id",
          name: "OwnerAdminDetail",
          component: () => import("../views/owner/AdminDetail.vue"),
          meta: { roles: ["superadmin", "owner"] },
          props: true,
        },
        {
          path: "owner/account", 
          name: "OwnerAccount",
          component: AccountMain,
          meta: { roles: ["superadmin", "owner"] }
        },

        // ===========================
        //       ADMIN ROUTES
        // ===========================
        {
          path: "admin/dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
          meta: { roles: ["superadmin", "owner", "admin"] } // ជួនកាល Owner ចង់មើលតារាង Admin ដែរ
        },
        {
          path: "admin/sellers",
          name: "manage-sellers",
          component: ManageSellers,
          meta: { roles: ["superadmin", "owner", "admin"] }
        },
        {
          path: "admin/sales",
          name: "input-sales",
          component: InputSales,
          meta: { roles: ["admin"] } // Admin សុទ្ធទើបបញ្ជូលបាន
        },
        {
          path: "admin/seller-reports",
          name: "seller-reports",
          component: SellerReports,
          meta: { roles: ["superadmin", "owner", "admin"] }
        },
        
        // ===========================
        //       SHARED ROUTES
        // ===========================
        {
          path: "/seller/:id/detail",
          name: "SellerSalesDetail", 
          component: SellerSalesDetail,
          meta: { roles: ["superadmin", "owner", "admin"] }
        },
      ],
    },
  ],
});

// ==========================================
//   ROUTER GUARD (ទប់ស្កាត់អ្នកគ្មានសិទ្ធិ)
// ==========================================
router.beforeEach(async (to, from, next) => {
  // ១. ឆែកមើលថាតើ Route នេះត្រូវការ Login ដែរឬទេ?
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth || record.meta.roles);
  
  if (requiresAuth) {
    const user = auth.currentUser;
    
    // បើអត់ទាន់ Login រុញទៅទំព័រ Login
    if (!user) {
      return next({ name: 'login' });
    }

    // ២. ទាញយក Role របស់ User ពី Firestore (ឬ Store របស់បង)
    try {
      const userDocRef = doc(db, 'users', user.uid); // កែតម្រូវ Collection name តាមរបស់បង
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userRole = userDocSnap.data().role; // អាចជា 'superadmin', 'owner', ឬ 'admin'

        // ៣. ឆែកមើលថាតើ Role របស់គាត់ មានសិទ្ធិចូលទំព័រនេះ (to.meta.roles) ឬទេ?
        if (to.meta.roles && !to.meta.roles.includes(userRole)) {
          // បើគ្មានសិទ្ធិទេ រុញត្រឡប់ទៅក្រោយ ឬទៅ Dashboard រៀងខ្លួន
          console.warn(`User role '${userRole}' cannot access ${to.path}`);
          if (userRole === 'admin') return next({ name: 'admin-dashboard' });
          if (userRole === 'owner') return next({ name: 'owner-dashboard' });
          return next({ name: 'login' }); // ករណីផ្សេង
        } else {
           next(); // មានសិទ្ធិ អនុញ្ញាតឲ្យទៅ
        }
      } else {
        // បើរកមិនឃើញ Document អ្នកប្រើប្រាស់
        next({ name: 'login' });
      }
    } catch (error) {
      console.error("Error fetching user role in router:", error);
      next({ name: 'login' });
    }
  } else {
    // បើ Route មិនត្រូវការ Login ទេ ឲ្យទៅធម្មតា (ឧទាហរណ៍ ទំព័រ Login)
    next();
  }
});

export default router;