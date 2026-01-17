// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Home from "./pages/Home.jsx";
// // import AddNewConsultancy from "./pages/AddNewConsultancy.jsx";
// // import Header from "./pages/components/Header.jsx";
// // import Footer from "./pages/components/Footer.jsx";
// // import Sidebar from "./pages/components/Sidebar.jsx";
// // import "./App.css";
// // import MasterAdminLogin from "./pages/MasterAdminLogin.jsx";
// // import Dashboard from "./pages/Dashboard.jsx";
// // import Login from "./pages/Login.jsx";
// // import AllConsultanciesPage from "./pages/AllConsultanciesPage.jsx";

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <div className="flex h-screen bg-[#F8FAFC]">
// //         <Sidebar />
// //         <div className="flex flex-col flex-1 overflow-hidden">
// //           <Header />
// //           <main className="flex-1 overflow-y-auto p-6">
// //             <Routes>
// //               <Route path="/login" element={<Login/>}/>
// //               <Route path="/master-admin-login" element={<MasterAdminLogin/>}/>
// //               <Route path="/all-consultancies" element={<AllConsultanciesPage/>}/>
// //               <Route path="/" element={<Home />} />
// //               <Route path="/dashboard" element={<Dashboard />} />
// //               <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
// //             </Routes>
// //           </main>
// //           <Footer />
// //         </div>
// //       </div>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;

// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import AddNewConsultancy from "./pages/AddNewConsultancy.jsx";
// import Header from "./pages/components/Header.jsx";
// import Footer from "./pages/components/Footer.jsx";
// import Sidebar from "./pages/components/Sidebar.jsx";
// import SuperAdminLogin from "./pages/super_admin/SuperAdminLogin.jsx";
// import Dashboard from "./pages/super_admin/Dashboard.jsx";
// import Login from "./pages/Login.jsx";
// import AllConsultanciesPage from "./pages/AllConsultanciesPage.jsx";
// import PrivateRoute from "./pages/components/PrivateRoute.jsx";
// import AddNewSuperAdmin from "./pages/super_admin/AddNewSuperAdmin.jsx";
// import AllSuperAdminPage from "./pages/super_admin/AllSuperAdminPage.jsx";
// import ViewSuperAdmin from "./pages/super_admin/ViewSuperAdmin.jsx";
// import EditSuperAdmin from "./pages/super_admin/EditSuperAdmin.jsx";
// import MyProfile from "./pages/super_admin/MyProfile.jsx";

// function AppContent() {
//   const location = useLocation();

//   // Routes where the sidebar should be hidden
//   const hideSidebarRoutes = ["/login", "/super-admin-login", "/"];
//   const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

//   // Routes where the header should be hidden
//   const hideHeaderRoutes = ["/login", "/super-admin-login"];
//   const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

//   return (
//     <div className="flex h-screen bg-[#F8FAFC]">
//       {!shouldHideSidebar && <Sidebar />}

//       <div className="flex flex-col flex-1 overflow-hidden">
//         {!shouldHideHeader && <Header />}
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/super-admin-login" element={<SuperAdminLogin />} />
//             <Route path="/" element={<Home />} />
//             <Route element={<PrivateRoute />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
//               <Route path="/all-consultancies" element={<AllConsultanciesPage />} />
//               <Route path="/add-new-superadmin" element={<AddNewSuperAdmin />} />
//               <Route path="/all-super-admin" element={<AllSuperAdminPage />} />
//               <Route path="/view-super-admin/:id" element={<ViewSuperAdmin />} />
//               <Route path="/edit-super-admin/:id" element={<EditSuperAdmin />} />
//               <Route path="/my-profile" element={<MyProfile />} />
//             </Route>
//           </Routes>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddNewConsultancy from "./pages/consultancy/AddNewConsultancy.jsx";
import Header from "./pages/components/Header.jsx";
import Footer from "./pages/components/Footer.jsx";
import Sidebar from "./pages/components/Sidebar.jsx";
import SuperAdminLogin from "./pages/super_admin/SuperAdminLogin.jsx";
import Dashboard from "./pages/super_admin/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import AllConsultanciesPage from "./pages/consultancy/AllConsultanciesPage.jsx";
import PrivateRoute from "./pages/components/PrivateRoute.jsx";
import AddNewSuperAdmin from "./pages/super_admin/AddNewSuperAdmin.jsx";
import AllSuperAdminPage from "./pages/super_admin/AllSuperAdminPage.jsx";
import ViewSuperAdmin from "./pages/super_admin/ViewSuperAdmin.jsx";
import EditSuperAdmin from "./pages/super_admin/EditSuperAdmin.jsx";
import MyProfile from "./pages/super_admin/MyProfile.jsx";
import CompanyProfile from "./pages/super_admin/CompanyProfile.jsx";
import PricingPage from "./pages/enrilo_pages/PricingPage.jsx";
import FeaturesPage from "./pages/enrilo_pages/FeaturesPage.jsx";
import ContactUs from "./pages/enrilo_pages/ContactUs.jsx";
import PrivacyPolicy from "./pages/enrilo_pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/enrilo_pages/TermsAndConditions.jsx";
import ViewConsultancy from "./pages/consultancy/ViewConsultancy.jsx";
import EditConsultancy from "./pages/consultancy/EditConsultancy.jsx";
import AddAPayment from "./pages/payment_details/AddAPayment.jsx";
import ViewAllPayments from "./pages/payment_details/ViewAllPayments.jsx";
import ViewAPayment from "./pages/payment_details/ViewAPayment.jsx";
import EditPayment from "./pages/payment_details/EditPayment.jsx";
import AddMasterAdmin from "./pages/master_admin/AddMasterAdmin.jsx";
import AllMasterAdmin from "./pages/master_admin/AllMasterAdmin.jsx";
import ViewMasterAdmin from "./pages/master_admin/ViewMasterAdmin.jsx";
import EditMasterAdmin from "./pages/master_admin/EditMasterAdmin.jsx";
import TermsOfService from "./pages/enrilo_pages/TermsOfService.jsx";

function AppContent() {
  const location = useLocation();

  const hideSidebarRoutes = ["/", "/login", "/super-admin-login", "/privacy-policy", "/contact-us", "/terms-and-conditions", "/pricing", "/features", "/terms-of-service"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  const hideHeaderRoutes = ["/login", "/super-admin-login"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {!shouldHideSidebar && <Sidebar />}

      <div className="flex flex-col flex-1 overflow-hidden">
        {!shouldHideHeader && <Header />}

        <Routes>
          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* 🔒 PRIVATE ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Consultancies  */}
            <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
            <Route path="/all-consultancies" element={<AllConsultanciesPage />} />
            <Route path="/view-consultancy/:id" element={<ViewConsultancy />} />
            <Route path="/edit-consultancy/:id" element={<EditConsultancy />} />
            {/* Super Admin  */}
            <Route path="/add-new-superadmin" element={<AddNewSuperAdmin />} />
            <Route path="/all-super-admin" element={<AllSuperAdminPage />} />
            <Route path="/view-super-admin/:id" element={<ViewSuperAdmin />} />
            <Route path="/edit-super-admin/:id" element={<EditSuperAdmin />} />
            {/* Payment Details  */}
            <Route path="/add-new-payment" element={<AddAPayment />} />
            <Route path="/all-payments" element={<ViewAllPayments />} />
            <Route path="/view-a-payment/:id" element={<ViewAPayment />} />
            <Route path="/edit-a-payment/:id" element={<EditPayment />} />
            {/* Master Admin  */}
            <Route path="/add-master-admin" element={<AddMasterAdmin />} />
            <Route path="/all-master-admin" element={<AllMasterAdmin />} />
            <Route path="/view-master-admin/:id" element={<ViewMasterAdmin />} />
            <Route path="/edit-master-admin/:id" element={<EditMasterAdmin />} />
            
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/our-company" element={<CompanyProfile />} />
            {/* 🚨 CATCH-ALL PROTECTED ROUTE */}
            <Route path="*" element={<Navigate to="/super-admin-login" replace />} />
          </Route>
        </Routes>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
