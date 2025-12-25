import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Select from "react-select";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getStorage, ref, deleteObject } from "firebase/storage";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { selectStyles } from "../styles/selectStyles.js";

export default function AllSuperAdminPage() {
  const [showDeleting, setShowDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allSuperAdmin, setAllSuperAdmin] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserID, setCurrentUserID] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState({ value: "", label: "All Roles" });
  const [filters, setFilters] = useState({ full_name: "", role: "", company_email: "", phone: "", position: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters); // For debounce
  const roleOptions = [ { value: "", label: "All Roles" }, { value: "admin", label: "Admin Role" }, { value: "user", label: "User Role" } ];
  const DEBOUNCE_DELAY = 500; // milliseconds (delay for loading after entering in searchbar)
  const navigate = useNavigate();
  const location = useLocation();
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const userState = JSON.parse(persistedRoot.user);
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;
  const role = userState.currentUser?.data?.role;

  // Sync filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      full_name: params.get("full_name") || "",
      role: params.get("role") || "",
      company_email: params.get("company_email") || "",
      phone: params.get("phone") || "",
      position: params.get("position") || "",
    };
    setFilters(newFilters);
    setSelectedRole({ value: newFilters.role, label: newFilters.role || "All Roles" });
  }, [location.search]);

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.set(key, newFilters[key]);
    });
    navigate({ search: params.toString() });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { full_name: "", role: "", company_email: "", phone: "", position: "" };
    setFilters(newFilters);
    setSelectedRole({ value: "", label: "All Roles" });
    updateURL(newFilters);
  };

  // Debounce filters
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [filters]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      setShowDeleting(true);
      // Fetch super admin details for deleting files
      const res = await fetch(`http://localhost:3000/api/super-admins/${deleteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) return;

      if (data.data.superAdmin.photo_url.includes("firebase")) {
        const storage = getStorage();
        const desertRef = ref(storage, data.data.superAdmin.photo_url);
        deleteObject(desertRef).catch(console.log);
      }
      for (let i = 0; i < data.data.superAdmin.documents.length; i++) {
        const docURL = data.data.superAdmin.documents[i].url;
        if (docURL.includes("firebase")) {
          const desertRef = ref(getStorage(), docURL);
          deleteObject(desertRef).catch(console.log);
        }
      }

      const deleteRes = await fetch(`http://localhost:3000/api/super-admins/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const deleteData = await deleteRes.json();
      if (!deleteData.success) return;

      setShowDeleting(false);
      setShowConfirmDelete(false);
      setShowSuccess(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const paginatedData = rowsPerPage > 0 ? allSuperAdmin.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSuperAdmin;

  // Fetch super admins whenever debounced filters change
  useEffect(() => {
    const fetchAllSuperAdmin = async () => {
      try {
        setPageLoading(true);
        setCurrentUserEmail(userState.currentUser?.data?.company_email);
        setCurrentUserID(userState.currentUser?.data?.id);

        const query = new URLSearchParams();
        Object.keys(debouncedFilters).forEach((key) => {
          if (debouncedFilters[key]) query.set(key, debouncedFilters[key]);
        });

        const res = await fetch(`http://localhost:3000/api/super-admins?${query.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await res.json();
        if (!data.success) {
          setAllSuperAdmin([]);
          setPageLoading(false);
          return;
        }
        setAllSuperAdmin(data.data.superAdmins);

        // Fetch write access
        const accessRes = await fetch(
          `http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const accessData = await accessRes.json();
        if (accessData.success) setAllowWriteAccess(accessData.data.accessToken.allow_write_access);

        setPageLoading(false);
      } catch (error) {
        setPageLoading(false);
      }
    };
    fetchAllSuperAdmin();
  }, [debouncedFilters]);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
          {/* 🔹 FILTER INPUTS */}
          <div className='flex flex-row justify-center mb-5'>
                <button onClick={() => setShowFilters(!showFilters)} className='bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition'>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
          {
            showFilters && (
              <div className="flex flex-wrap gap-4 mb-10 items-center justify-center">
                <div>
                  <TextField id="full_name" label="Search By Full Name" value={filters.full_name} onChange={(e) => handleFilterChange("full_name", e.target.value)} variant="outlined" fullWidth />
                </div>
                <div>
                  <Select id="role" options={roleOptions} value={selectedRole} placeholder="Role" isSearchable menuPortalTarget={document.body} styles={selectStyles} onChange={(sel) => { setSelectedRole(sel); handleFilterChange("role", sel?.value || ""); }} />
                </div>
                <div>
                  <TextField id="company_email" label="Search By Email" value={filters.company_email} onChange={(e) => handleFilterChange("company_email", e.target.value)} variant="outlined" fullWidth />
                </div>
                <div>
                  <TextField id="phone" label="Search By Phone Number" value={filters.phone} onChange={(e) => handleFilterChange("phone", e.target.value)} variant="outlined" fullWidth />
                </div>
                <div>
                  <TextField id="position" label="Search By Position" value={filters.position} onChange={(e) => handleFilterChange("position", e.target.value)} variant="outlined" fullWidth />
                </div>
                <button onClick={clearFilters} className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                  Clear Filters
                </button>
              </div>
            )
          }

          {/* 🔹 TABLE */}
          <div className="overflow-x-auto rounded-lg">
            {allowWriteAccess && role === "admin" && (
              <div className="flex justify-end mb-5">
                <Link to={`/add-new-superadmin`} className="flex flex-row justify-center">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                    Add New Super Admin
                  </button>
                </Link>
              </div>
            )}
            <table className="min-w-full text-sm md:text-[17px] text-left border-collapse rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase rounded-lg">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">Name</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-50">Company Email</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">Phone Number</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">Position</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Role</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((superadmin, index) => (
                  <tr key={superadmin._id} className="border-b hover:bg-gray-50 transition text-gray-800">
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium w-8 md:w-12">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">{superadmin.full_name}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-50">{superadmin.company_email}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">{superadmin.country_code} {superadmin.phone}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">{superadmin.position}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20 capitalize">{superadmin.role}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">
                      <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
                        {superadmin._id !== currentUserID && (
                          <>
                            <Link to={`/view-super-admin/${superadmin._id}`}>
                              <button className="bg-slate-500 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">View</button>
                            </Link>
                            {allowWriteAccess && role === "admin" && (
                              <>
                                <Link to={`/edit-super-admin/${superadmin._id}`}>
                                  <button className="bg-[#1E293B] hover:bg-[#334155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">Edit</button>
                                </Link>
                                <button onClick={() => confirmDelete(superadmin._id)} className="bg-red-700 hover:bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                        {superadmin.company_email === currentUserEmail && (
                          <Link to={`/my-profile`}>
                            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">View Your Profile</button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Pagination Footer */}
              <tfoot>
                <tr>
                  <td colSpan={7}>
                    <div className="flex items-center justify-between mt-4 px-3 py-2 bg-gray-50 text-sm md:text-base">
                      <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select className="border rounded px-2 py-1" value={rowsPerPage} onChange={(e) => { const value = parseInt(e.target.value, 10); setRowsPerPage(value); setPage(0); }}>
                          {[5, 10, 25, -1].map((num) => (
                            <option key={num} value={num}>
                              {num === -1 ? "All" : num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: 1 }} />

                      <div className="flex items-center gap-2">
                        <span>
                          {rowsPerPage === -1 ? `1–${allSuperAdmin.length} of ${allSuperAdmin.length}` : `${Math.min(page * rowsPerPage + 1, allSuperAdmin.length)}–${Math.min( (page + 1) * rowsPerPage, allSuperAdmin.length )} of ${allSuperAdmin.length}`}
                        </span>
                        <button onClick={() => setPage(0)} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <FirstPageRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <ChevronLeftRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(allSuperAdmin.length / rowsPerPage) - 1))} disabled={page >= Math.ceil(allSuperAdmin.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <ChevronRightRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage(Math.ceil(allSuperAdmin.length / rowsPerPage) - 1)} disabled={page >= Math.ceil(allSuperAdmin.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <LastPageRoundedIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* DELETE CONFIRM MODAL */}
          {showConfirmDelete && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this super admin?</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={handleDeleteConfirmed}>
                    Yes
                  </button>
                  <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setShowConfirmDelete(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS MODAL */}
          {showSuccess && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">Super Admin has been deleted!</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); window.location.reload(true); }}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleting && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <div className="text-xl font-semibold flex justify-center items-center gap-3">
                  <div className="w-20 h-20">
                    <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                      <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
                        e
                      </text>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold mb-2">Deleting...</p>
                    <p className="text-[#334155]">Please hold on! The super admin is being deleted.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOADING MODAL */}
          {pageLoading && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <div className="text-xl font-semibold flex justify-center items-center gap-3">
                  <div className="w-20 h-20">
                    <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                      <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
                        e
                      </text>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold mb-2">Loading...</p>
                    <p className="text-[#334155]">Please wait while we load the details of all super admin.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}