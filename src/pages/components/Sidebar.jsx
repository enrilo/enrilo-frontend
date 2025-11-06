import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, Users, Settings as SettingsIcon, Home, LogOut, Menu, X, User, BriefcaseBusiness, UserPlusIcon, UserPlus, IdCard, IndianRupeeIcon, LayoutDashboard, Building } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();

  // --- Menu Structure ---
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", subMenu: null },
    {
      name: "Consultancy Details",
      icon: <User size={18} />,
      subMenu: [
        { name: "Add Consultancy", icon: <UserPlus size={18} />, path: "/add-new-consultancy" },
        { name: "All Consultancies", icon: <Users size={18} />, path: "/all-consultancies" },
        { name: "All Payment Details", icon: <IndianRupeeIcon size={18} />, path: "/consultancy/payments" },
      ],
    },
    {
      name: "Super Admin Details",
      icon: <Users size={18} />,
      subMenu: [
        { name: "Add Super Admin", icon: <UserPlus size={18} />, path: "/superadmin/add" },
        { name: "All Super Admin", icon: <Users size={18} />, path: "/superadmin/all" },
      ],
    },
    {
      name: "Master Admin Details",
      icon: <BriefcaseBusiness size={18} />,
      subMenu: [
        { name: "Add Master Admin", icon: <UserPlus size={18} />, path: "/masteradmin/add" },
        { name: "All Master Admin", icon: <Users size={18} />, path: "/masteradmin/all" },
      ],
    },
    {
      name: "Company Details",
      icon: <IdCard size={18} />,
      subMenu: [
        { name: "Company Profile", icon: <Building size={18} />, path: "/company/profile" },
        { name: "GST Collection", icon: <IndianRupeeIcon size={18} />, path: "/company/gst" },
      ],
    },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <SettingsIcon size={18} />, path: "/settings" },
    { name: "Sign Out", icon: <LogOut size={18} />, path: "/signout" },
  ];

  // --- Auto set active menu on route change ---
  useEffect(() => {
    const matchedMenu = menuItems.find(
      (item) =>
        item.path === location.pathname ||
        item.subMenu?.some((sub) => sub.path === location.pathname)
    );
    if (matchedMenu?.subMenu) {
      setActiveMenu(matchedMenu.name);
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const toggleSubMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // --- Render Menu Items ---
  const renderMenuItems = () =>
    menuItems.map((item, idx) => {
      const hasSubMenu = !!item.subMenu;
      const isSubActive = item.subMenu?.some((sub) => sub.path === location.pathname);
      const isMenuActive = location.pathname === item.path;

      return (
        <li key={idx}>
          {hasSubMenu ? (
            <>
              <button onClick={() => toggleSubMenu(item.name)} className={`flex items-center justify-between w-full p-2 rounded-md transition-all duration-200 ${ isSubActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]" }`} >
                <div className="flex items-center space-x-3">
                  <span>{item.icon}</span>
                  {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                </div>
                {isOpen && (
                  <span>
                    {activeMenu === item.name ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                )}
              </button>

              {isOpen && activeMenu === item.name && (
                <ul className="ml-10 mt-2 space-y-1">
                  {item.subMenu.map((sub, subIdx) => {
                    const isActive = location.pathname === sub.path;
                    return (
                      <li key={subIdx}>
                        <Link to={sub.path} className={`flex justify-between items-center text-sm rounded-md px-3 py-2 transition ${ isActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#475569]" }`} >
                          <span>{sub.icon}</span>
                          <span>{sub.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <Link to={item.path} className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ${ isMenuActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]" }`} >
              <span>{item.icon}</span>
              {isOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          )}
        </li>
      );
    });

  // --- Render Bottom Menu ---
  const renderBottomMenu = () =>
    bottomMenu.map((item, idx) => {
      const isActive = location.pathname === item.path;
      return (
        <li key={idx}>
          <Link to={item.path} className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ${ isActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]" }`} >
            <span>{item.icon}</span>
            {isOpen && <span className="text-sm">{item.name}</span>}
          </Link>
        </li>
      );
    });

  return (
    <>
      {/* --- Mobile Hamburger --- */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1E293B] text-white shadow" onClick={() => setMobileOpen(true)} >
        <Menu size={24} />
      </button>

      {/* --- Sidebar --- */}
      <aside className={`fixed md:static top-0 left-0 h-screen bg-[#1E293B] text-white flex flex-col justify-between transition-all duration-300 z-40 ${ isOpen ? "w-64" : "w-20" } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} >
        {/* Header + Menu */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col justify-between">
          <div>
            <h1 className={`text-xl font-bold text-yellow-400 mb-6 transition-opacity duration-300 ${ !isOpen && "opacity-0" }`} >
              Enrilo
            </h1>

            <ul className="space-y-3">{renderMenuItems()}</ul>
          </div>

          {/* Bottom Menu */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <ul className="space-y-2">{renderBottomMenu()}</ul>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <div className="flex justify-center p-4 border-t border-gray-700">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full bg-[#334155] hover:bg-[#475569] transition" >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Mobile Close Button */}
        <button className="md:hidden absolute top-4 right-4 p-2 rounded-md bg-[#334155] hover:bg-[#475569]" onClick={() => setMobileOpen(false)} >
          <X size={24} />
        </button>
      </aside>

      {/* --- Mobile Overlay --- */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} ></div>
      )}
    </>
  );
}