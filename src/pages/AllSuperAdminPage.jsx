import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link, useNavigate } from 'react-router-dom';


export default function AllSuperAdminPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allSuperAdmin, setAllSuperAdmin] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDelete = (id) => {
      setDeleteId(id);
      setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    // Parse the nested user slice
    const userState = JSON.parse(persistedRoot.user);
    // Extract token
    const token = userState.currentUser?.data?.accessToken;
    try {
      const res = await fetch(`http://localhost:3000/api/super-admins/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
          console.log(data.message);
          return;
      }
      setShowConfirmDelete(false);
      setShowSuccess(true);
      setTimeout(() => {
          window.location.reload(true);
          // navigate("/all-todos");
      }, 1500);
    } catch (error) {
        console.log(error.message);
    }
  };

  const paginatedData = rowsPerPage > 0 ? allSuperAdmin.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSuperAdmin;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const CustomTablePagination = styled(TablePagination)` & .MuiTablePagination-toolbar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; background-color: #f9fafb; flex-wrap: wrap; } & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows { font-size: 14px; }`;

  useEffect(() => {
    const fetchSuperAdmin = async () => {

      try {
        const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
        // Parse the nested user slice
        const userState = JSON.parse(persistedRoot.user);
        // Extract token
        const token = userState.currentUser?.data?.accessToken;
        console.log("Token from localStorage:", token);
        setCurrentUserEmail(userState.currentUser?.data?.superAdmin?.company_email);
        const res = await fetch("http://localhost:3000/api/super-admins/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await res.json();
        console.log("All superadmin data:", data); // ✅ Proper console.log

        if (data.success === false) {
          // setShowTodosError(true);
          return;
        }

        console.log("All superadmin data:", data.data.superAdmins); // ✅ Proper console.log
        setAllSuperAdmin(data.data.superAdmins);
      } catch (error) {
        console.error("Error fetching superadmin data:", error);
        // setShowTodosError(true);
      }
    };

    fetchSuperAdmin();
  }, []); // ✅ If `token` changes, you may want to add it as a dependency


  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm md:text-[17px] text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                    Super Admin Name
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                    Company Email
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">
                    Phone Number
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                    Position
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-48">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((c, index) => (
                  <tr key={c._id} className="border-b hover:bg-gray-50 transition text-gray-800">
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center">{c.full_name}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                      {c.company_email}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center">{c.country_code} {c.phone}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                      {c.position}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                      <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                        <Link to={`/view-super-admin/${c._id}`} className='flex flex-row justify-center'>
                          <button className="bg-slate-500 hover:bg-slate-600 text-white cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                            View
                          </button>
                        </Link>
                        <Link to={`/edit-super-admin/${c._id}`} className='flex flex-row justify-center'>
                          <button className="bg-slate-800 hover:bg-slate-900 text-white cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                            Edit
                          </button>
                        </Link>
                        {c.company_email !== currentUserEmail && (
                          <button onClick={() => confirmDelete(c._id)} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                            Delete
                          </button>
                        )}
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <CustomTablePagination rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]} colSpan={7} count={allSuperAdmin.length} rowsPerPage={rowsPerPage} page={page}
                    slotProps={{
                      select: { "aria-label": "rows per page" },
                      actions: {
                        showFirstButton: true,
                        showLastButton: true,
                        slots: {
                          firstPageIcon: FirstPageRoundedIcon,
                          lastPageIcon: LastPageRoundedIcon,
                          nextPageIcon: ChevronRightRoundedIcon,
                          backPageIcon: ChevronLeftRoundedIcon,
                        },
                      },
                    }} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
                </tr>
              </tfoot>
            </table>
          </div>

          {showConfirmDelete && (

            <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium mb-5">Are you sure you want to delete this super admin?</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#334155] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={handleDeleteConfirmed} >
                    Yes
                  </button>
                  <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setShowConfirmDelete(false)} >
                    No
                  </button>
                </div>
              </div>
            </div>
            
          )}

          {showSuccess && (
            <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
                <div className="flex flex-row bg-[rgb(7,57,106)] text-white p-3 rounded-lg shadow-lg">
                    <p>Super Admin has been deleted!</p>
                    <button className="ml-2 font-bold hover:cursor-pointer text-white" onClick={() => {
                        setShowSuccess(false);
                        window.location.reload(true);
                        // navigate("/all-todos");
                    }} >✖</button>
                </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
