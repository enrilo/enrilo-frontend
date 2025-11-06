import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, 
  Users, User, BriefcaseBusiness, UserPlus, 
  IdCard, IndianRupeeIcon, LayoutDashboard, Building, 
  Settings as SettingsIcon, LogOut, Menu, X 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import enriloFullLogoSrc from '../../assets/images/transparent-background/enrilo-with-tagline-300x300.png';
import enriloLetterESrc from '../../assets/images/transparent-background/enrilo-e-100x100.png';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();

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

  // Auto-set active menu
  useEffect(() => {
    const matched = menuItems.find(
      item => item.path === location.pathname || item.subMenu?.some(sub => sub.path === location.pathname)
    );
    setActiveMenu(matched?.subMenu ? matched.name : null);
  }, [location.pathname]);

  const toggleSubMenu = (menuName) => setActiveMenu(activeMenu === menuName ? null : menuName);

  const MenuLink = ({ icon, name, path, isActive }) => (
    <Link to={path} className={`flex items-center p-2 rounded-md transition-all duration-200 ${
        isActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
      }`} title={!isOpen ? name : ""}>
      <span className="flex justify-center w-6">{icon}</span>
      {isOpen && <span className="ml-3 text-sm">{name}</span>}
    </Link>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-[#1E293B] text-white shadow" onClick={() => setMobileOpen(true)} >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-screen bg-[#1E293B] text-white flex flex-col justify-between transition-all duration-300 z-40 overflow-hidden ${
          isOpen ? "w-64" : "w-20"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Scrollable container */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-4 pl-4 pr-4 autoscroll-container">
          <img src={isOpen ? enriloFullLogoSrc : enriloLetterESrc} alt="Enrilo" className="rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2" />

          <ul className="mt-4 space-y-3">
            {menuItems.map((item, idx) => {
              const hasSubMenu = !!item.subMenu;
              const isMenuActive = location.pathname === item.path || item.subMenu?.some(sub => sub.path === location.pathname);

              return (
                <li key={idx} className="relative group">
                  {hasSubMenu ? (
                    <>
                      <button title={!isOpen ? item.name : ""} onClick={() => toggleSubMenu(item.name)} className={`flex items-center cursor-pointer justify-between w-full p-2 rounded-md transition-all duration-300 ${
                          isMenuActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
                        }`} >
                        <div className="flex items-center space-x-3 cursor-pointer">
                          <span>{item.icon}</span>
                          {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                        </div>
                        {isOpen &&
                          (activeMenu === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>

                      {/* Submenu with smooth open/close */}
                      <ul className={`ml-10 mt-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ${
                          activeMenu === item.name && isOpen ? "max-h-64" : "max-h-0"
                        }`} >
                        {item.subMenu.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <MenuLink icon={sub.icon} name={sub.name} path={sub.path} isActive={location.pathname === sub.path} />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <MenuLink icon={item.icon} name={item.name} path={item.path} isActive={isMenuActive} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom menu */}
        <div className="border-t border-gray-700 p-4 flex-shrink-0">
          <ul className="space-y-2">
            {bottomMenu.map((item, idx) => (
              <li key={idx}>
                <MenuLink icon={item.icon} name={item.name} path={item.path} isActive={location.pathname === item.path} />
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar toggle (floating at bottom-right) */}
        <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer absolute bottom-21 right-[-19px] p-4 rounded-full bg-[#334155] hover:bg-[#475569] transition z-50 shadow-lg flex items-center justify-center" >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Mobile close */}
        <button className="md:hidden absolute top-4 right-4 p-2 rounded-md bg-[#334155] hover:bg-[#475569]" onClick={() => setMobileOpen(false)}>
          <X size={24} />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  );
}