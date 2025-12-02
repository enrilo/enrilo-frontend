import { useState, useEffect } from "react";
import { persistor } from "../../redux/store";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Users, User, BriefcaseBusiness, UserPlus, IdCard, IndianRupeeIcon, LayoutDashboard, Building, Settings as SettingsIcon, LogOut, Menu, X, BriefcaseMedical, GraduationCap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import enriloFullLogoSrc from '../../assets/images/transparent-background/enrilo-with-tagline-300x300.png';
import enriloLetterESrc from '../../assets/images/transparent-background/enrilo-e-100x100.png';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // ✅ for modal
  const location = useLocation();
  const navigate = useNavigate(); // ✅ navigation after logout

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    {
      name: "Super Admin Details",
      icon: <Users size={18} />,
      matchPrefixes:["/view-super-admin", "/edit-super-admin"],
      subMenu: [
        { name: "Add Super Admin", icon: <UserPlus size={18} />, path: "/add-new-superadmin" },
        { name: "All Super Admin", icon: <Users size={18} />, path: "/all-super-admin" },
      ],
    }, {
      name: "Consultancy Details",
      icon: <BriefcaseBusiness size={18} />,
      subMenu: [
        { name: "Add Consultancy", icon: <BriefcaseMedical size={18} />, path: "/add-new-consultancy" },
        { name: "All Consultancies", icon: <GraduationCap size={18} />, path: "/all-consultancies" },
        { name: "All Payment Details", icon: <IndianRupeeIcon size={18} />, path: "/consultancy/payments" },
      ],
    }, {
      name: "Master Admin Details",
      icon: <Users size={18} />,
      subMenu: [
        { name: "Add Master Admin", icon: <UserPlus size={18} />, path: "/masteradmin/add" },
        { name: "All Master Admin", icon: <Users size={18} />, path: "/masteradmin/all" },
      ],
    }, {
      name: "Company Details",
      icon: <IdCard size={18} />,
      subMenu: [
        { name: "Company Profile", icon: <Building size={18} />, path: "/company/profile" },
        { name: "GST Collection", icon: <IndianRupeeIcon size={18} />, path: "/company/gst" },
      ],
    },

    { name: "My Profile", icon: <User size={18} />, path: "/my-profile" },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <SettingsIcon size={18} />, path: "/settings" },
    { name: "Logout", icon: <LogOut size={18} />, action: "logout" }, // ✅ changed from path to action
  ];

  useEffect(() => {
    const matched = menuItems.find(
      item => item.path === location.pathname || item.subMenu?.some(sub => sub.path === location.pathname)
    );
    setActiveMenu(matched?.subMenu ? matched.name : null);
  }, [location.pathname]);

  const toggleSubMenu = (menuName) => setActiveMenu(activeMenu === menuName ? null : menuName);

  // const handleLogout = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3000/api/super-admins/logout', {
  //       method: 'POST',
  //       credentials: 'include',
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       alert("You have been logged out successfully.");
  //       navigate('/'); // ✅ redirect to home
  //     } else {
  //       alert("Logout failed. Try Again.");
  //     }
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //     alert("⚠️ Server error while logging out.");
  //   }
  // };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/super-admins/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {

        // 🔥 Clear Redux Persist cache
        await persistor.purge();

        // 🔥 Remove localStorage (optional but clean)
        localStorage.clear();

        alert("You have been logged out successfully.");
        navigate("/");
      } else {
        alert("Logout failed. Try Again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("⚠️ Server error during logout");
    }
  };

  const MenuLink = ({ icon, name, path, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full p-2 rounded-md transition-all duration-200 text-left ${
        isActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
      }`} title={!isOpen ? name : ""}>
      <span className="flex justify-center w-6">{icon}</span>
      {isOpen && <span className="ml-3 text-sm">{name}</span>}
    </button>
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
        <div className="flex-1 flex flex-col overflow-y-auto pb-4 pl-4 pr-4">
          <img src={isOpen ? enriloFullLogoSrc : enriloLetterESrc} alt="Enrilo" className="rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2" />

          <ul className="mt-4 space-y-3">
            {menuItems.map((item, idx) => {
              const hasSubMenu = !!item.subMenu;
              // const isMenuActive = location.pathname === item.path || item.subMenu?.some(sub => sub.path === location.pathname);
              const isMenuActive = location.pathname === item.path || item.subMenu?.some(sub => sub.path === location.pathname) || item.matchPrefixes?.some(prefix => location.pathname.startsWith(prefix));


              return (
                <li key={idx} className="relative group">
                  {hasSubMenu ? (
                    <>
                      <button onClick={() => toggleSubMenu(item.name)} className={`flex items-center justify-between w-full p-2 rounded-md transition-all duration-300 cursor-pointer ${
                          isMenuActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
                        }`}>
                        <div className="flex items-center space-x-3">
                          <span>{item.icon}</span>
                          {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                        </div>
                        {isOpen && (activeMenu === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>

                      <ul className={`ml-10 mt-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ${
                          activeMenu === item.name && isOpen ? "max-h-64" : "max-h-0"
                        }`}>
                        {item.subMenu.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link to={sub.path} className={`flex items-center p-2 rounded-md ${
                              location.pathname === sub.path ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
                            }`}>
                              <span className="flex justify-center w-6">{sub.icon}</span>
                              {isOpen && <span className="ml-3 text-sm">{sub.name}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link to={item.path} className={`flex items-center p-2 rounded-md ${
                      isMenuActive ? "bg-[#475569] text-yellow-300 font-semibold" : "hover:bg-[#334155]"
                    }`}>
                      <span className="flex justify-center w-6">{item.icon}</span>
                      {isOpen && <span className="ml-3 text-sm">{item.name}</span>}
                    </Link>
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
                {item.action === "logout" ? (
                  <div onClick={() => setShowLogoutConfirm(true)} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[#334155]">
                    <span className="flex justify-center w-6">{item.icon}</span>
                    {isOpen && <span className="ml-3 text-sm">{item.name}</span>}
                  </div>


                  // <MenuLink icon={item.icon} name={item.name} onClick={() => setShowLogoutConfirm(true)} className="cursor-pointer" />
                ) : (
                  <Link to={item.path} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[#334155]">
                    <span className="flex justify-center w-6">{item.icon}</span>
                    {isOpen && <span className="ml-3 text-sm">{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar toggle */}
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

      {/* ✅ Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-3">Confirm Logout</h3>
            <p className="mb-5">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setShowLogoutConfirm(false); handleLogout(); }} className="bg-red-600 text-white border-2 px-4 py-2 rounded-md hover:bg-red-700 transition cursor-pointer">
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="bg-gray-300 border-2 px-4 py-2 rounded-md hover:bg-gray-400 transition cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}