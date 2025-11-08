import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Dynamic title map
  const titleMap = {
    "/": "Home Page",
    "/login": "Login",
    "/master-admin-login": "Login",
    "/dashboard": "Dashboard",
    "/add-new-consultancy": "Add New Consultancy",
    "/all-consultancies": "All Consultancies",
    "/consultancy/payments": "All Payment Details",
    "/add-new-superadmin": "Add Super Admin",
    "/superadmin/all": "All Super Admin",
    "/masteradmin/add": "Add Master Admin",
    "/masteradmin/all": "All Master Admin",
    "/company/profile": "Company Profile",
    "/company/gst": "GST Collection",
    "/settings": "Settings",
  };

  const currentTitle = titleMap[location.pathname] || "Enrilo Dashboard";

  return (
    <header className="bg-white shadow p-4 flex flex-row justify-center">
      <h1 className="text-xl font-semibold text-gray-800">{currentTitle}</h1>
    </header>
  );
}
