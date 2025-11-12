import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link, useParams } from 'react-router-dom';
import { getStorage, ref, deleteObject} from 'firebase/storage';

export default function AllSuperAdminPage() {
  const params = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allSuperAdmin, setAllSuperAdmin] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDelete = (id) => {
      console.log(`confirmDelete id:${id}`);
      setDeleteId(id);
      setShowConfirmDelete(true);
  };

 const handleDeleteConfirmed = async () => {
    // setLoading(true);
    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    // Parse the nested user slice
    const userState = JSON.parse(persistedRoot.user);
    // Extract token
    const token = userState.currentUser?.data?.accessToken;

    console.log(`params.id:${params.id}`);
    console.log(`deleteId:${deleteId}`);
    const res = await fetch(`http://localhost:3000/api/super-admins/${deleteId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    // console.log(`data:${JSON.stringify(data.data.superAdmin)}`);
    
    if(data.success === false){
        // setLoading(false);
        console.log("data.success === false");
        return;
    }

    if(data.data.superAdmin.photo_url.includes('firebase')) {
    const storage = getStorage();
    const desertRef = ref(storage, data.data.superAdmin.photo_url);
    deleteObject(desertRef).then(() => {
        console.log("Profile Pic Removed Successfully")
    }).catch((error) => {
    console.log("Failed To Remove Image");
        console.log(error)
    });
    }
    for(var i=0; i < data.data.superAdmin.documents.length;i++) {
      const storage = getStorage();
      if(data.data.superAdmin.documents[i].url.includes('firebase')){
        var docURL = data.data.superAdmin.documents[i].url;
        const desertRef = ref(storage, docURL);
        deleteObject(desertRef).then(() => {
            console.log(`Document with URL ${docURL} Removed Successfully`)
        }).catch((error) => {
        console.log("Failed To Remove Image");
            console.log(error)
        });
      }
    }
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

    // setTimeout(() => {
    //     window.location.reload(true);
    // }, 1500);
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
          <div className="overflow-x-auto rounded-lg">
            <div className="flex justify-end mb-5">
              <Link to={`/add-new-superadmin`} className='flex flex-row justify-center'>
                <button className="bg-slate-800 hover:bg-slate-900 text-white cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                  Add New Super Admin
                </button>
              </Link>
            </div>
            <table className="min-w-full text-sm md:text-[17px] text-left border-collapse rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase rounded-lg">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                    Super Admin Name
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-50">
                    Company Email
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">
                    Phone Number
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">
                    Position
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((c, index) => (
                  <tr key={c._id} className="border-b hover:bg-gray-50 transition text-gray-800">
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium w-8 md:w-12">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">{c.full_name}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-50">
                      {c.company_email}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">{c.country_code} {c.phone}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">
                      {c.position}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">
                      <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
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
                          <button onClick={() => confirmDelete(c._id)} className="bg-red-700 hover:bg-red-600 text-white cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                            Delete
                          </button>
                        )}
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="rounded-lg">
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
                <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this super admin?</p>
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
                    <p className="mb-4 text-xl">Super Admin has been deleted!</p>
                    <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => { setShowSuccess(false); window.location.reload(true); }}>
                      OK
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
