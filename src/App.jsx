// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import AddNewConsultancy from "./pages/AddNewConsultancy.jsx";
// import Header from "./pages/components/Header.jsx";
// import Footer from "./pages/components/Footer.jsx";
// import Sidebar from "./pages/components/Sidebar.jsx";
// import "./App.css";
// import MasterAdminLogin from "./pages/MasterAdminLogin.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import Login from "./pages/Login.jsx";
// import AllConsultanciesPage from "./pages/AllConsultanciesPage.jsx";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="flex h-screen bg-[#F8FAFC]">
//         <Sidebar />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           <Header />
//           <main className="flex-1 overflow-y-auto p-6">
//             <Routes>
//               <Route path="/login" element={<Login/>}/>
//               <Route path="/master-admin-login" element={<MasterAdminLogin/>}/>
//               <Route path="/all-consultancies" element={<AllConsultanciesPage/>}/>
//               <Route path="/" element={<Home />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddNewConsultancy from "./pages/AddNewConsultancy.jsx";
import Header from "./pages/components/Header.jsx";
import Footer from "./pages/components/Footer.jsx";
import Sidebar from "./pages/components/Sidebar.jsx";
import SuperAdminLogin from "./pages/SuperAdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import AllConsultanciesPage from "./pages/AllConsultanciesPage.jsx";
import PrivateRoute from "./pages/components/PrivateRoute.jsx";
import "./App.css";
import AddNewSuperAdmin from "./pages/AddNewSuperAdmin.jsx";
import AllSuperAdminPage from "./pages/AllSuperAdminPage.jsx";

function AppContent() {
  const location = useLocation();

  // Routes where the sidebar should be hidden
  const hideSidebarRoutes = ["/login", "/super-admin-login", "/"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  // Routes where the header should be hidden
  const hideHeaderRoutes = ["/login", "/super-admin-login"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {!shouldHideSidebar && <Sidebar />}

      <div className="flex flex-col flex-1 overflow-hidden">
        {!shouldHideHeader && <Header />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
              <Route path="/all-consultancies" element={<AllConsultanciesPage />} />
              <Route path="/add-new-superadmin" element={<AddNewSuperAdmin />} />
              <Route path="/all-superadmin" element={<AllSuperAdminPage />} />
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