import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  // Dynamic title map
  const titleMap = {
    "/": "Enrilo",
    "/login": "Login",
    "/master-admin-login": "Login",
    "/dashboard": "Dashboard",
    "/add-new-consultancy": "Add New Consultancy",
    "/all-consultancies": "All Consultancies",
    "/all-payments": "All Payment Details",
    "/view-a-payment": "Payment Details",
    "/add-new-payment": "Add New Payment Details",
    "/edit-a-payment": "Edit Payment",
    "/add-new-superadmin": "Add Super Admin",
    "/all-super-admin": "All Super Admin",
    "/edit-super-admin": "Update Super Admin",
    "/view-super-admin": "View Super Admin",
    "/masteradmin/add": "Add Master Admin",
    "/masteradmin/all": "All Master Admin",
    "/our-company": "Our Company",
    "/my-profile": "Profile Page",
    "/company/gst": "GST Collection",
    "/settings": "Settings",
    "/pricing": "Pricing Page",
    "/features": "Our Features",
    "/contact-us": "Contact Us",
    "/privacy-policy": "Privacy Policy",
    "/terms": "Terms & Conditions",
  };

  let currentTitle = "Enrilo Dashboard";

  // ✅ 1️⃣ Exact match first
  if (titleMap[path]) {
    currentTitle = titleMap[path];
  } else if (/^\/edit-super-admin\/[A-Za-z0-9_-]+$/.test(path)) {
    currentTitle = "Update Super Admin";
  } else if (/^\/view-super-admin\/[A-Za-z0-9_-]+$/.test(path)) {
    currentTitle = "View Super Admin";
  } else if (/^\/consultancy\/\d+\/payments$/.test(path)) {
    currentTitle = "Consultancy Payments";
  }
  // Add more patterns if needed
  else {
    currentTitle = "Enrilo";
  }

  return (
    <header className="bg-white shadow p-4 flex flex-row justify-center">
      <h1 className="text-xl font-semibold text-gray-800">{currentTitle}</h1>
    </header>
  );
}
