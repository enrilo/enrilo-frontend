import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddNewConsultancy from "./pages/AddNewConsultancy.jsx";
import Header from "./pages/components/Header.jsx";
import Footer from "./pages/components/Footer.jsx";
import Sidebar from "./pages/components/Sidebar.jsx";
import "./App.css";
import MasterAdminLogin from "./pages/MasterAdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import AllConsultanciesPage from "./pages/AllConsultanciesPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/master-admin-login" element={<MasterAdminLogin/>}/>
              <Route path="/all-consultancies" element={<AllConsultanciesPage/>}/>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-new-consultancy" element={<AddNewConsultancy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;