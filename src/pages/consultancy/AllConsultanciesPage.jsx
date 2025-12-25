import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import { getStorage, ref, deleteObject } from "firebase/storage";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function AllConsultanciesPage() {
  const [pageLoading, setPageLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [currentUserID, setCurrentUserID] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const userState = JSON.parse(persistedRoot.user);
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;
  const role = userState.currentUser?.data?.role;

  // const consultancies = [
  //   {
  //     id: 1,
  //     name: "ABX Consultancy",
  //     website: "abxconsulting.in",
  //     gst: "ABC1234",
  //     address: "Vadodara, India",
  //     branches: "Vadodara, Bhavnagar",
  //   }, {
  //     id: 2,
  //     name: "AdmidTech",
  //     website: "admidtech.com",
  //     gst: "ABC4321",
  //     address: "Ahmedabad, India",
  //     branches: "Ahmedabad",
  //   }, {
  //     id: 3,
  //     name: "RK Desai Consulting",
  //     website: "rkdesaiconsulting.com",
  //     gst: "1234ABCD",
  //     address: "Rajkot, India",
  //     branches: "Rajkot",
  //   }, {
  //     id: 4,
  //     name: "Emaar Consultancy",
  //     website: "emaarconsulting.com",
  //     gst: "ABCD1234",
  //     address: "Dubai, UAE",
  //     branches: "Dubai, Sharjah",
  //   }, {
  //     id: 5,
  //     name: "Trump Consultancy",
  //     website: "trumpconsulting.com",
  //     gst: "EFGH9971",
  //     address: "New York City, USA",
  //     branches: "New York City",
  //   }, {
  //     id: 6,
  //     name: "J&J Education",
  //     website: "jjeducation.com",
  //     gst: "ES9284FF",
  //     address: "London, UK",
  //     branches: "London, Leicester",
  //   }, {
  //     id: 7,
  //     name: "SOSA Admissions",
  //     website: "sosaadmissions.com",
  //     gst: "XY2P9Z00",
  //     address: "Sydney, Australia",
  //     branches: "Sydney, Adelaide",
  //   },
  // ];

    // Fetch super admins whenever debounced filters change
  useEffect(() => {
    const fetchAllConsultancies = async () => {
      try {
        setPageLoading(true);
        setCurrentUserEmail(userState.currentUser?.data?.company_email);
        setCurrentUserID(userState.currentUser?.data?.id);

        const res = await fetch(`http://localhost:3000/api/consultancies/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) {
        console.log(`Could not fetch data`);
          setAllConsultancies([]);
          setPageLoading(false);
          return;
        }
        
        setAllConsultancies(data.data.consultancies);

        // Fetch write access
        const accessRes = await fetch(
          `http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const accessData = await accessRes.json();
        if (accessData.success) setAllowWriteAccess(accessData.data.accessToken.allow_write_access);

        setPageLoading(false);
      } catch (error) {
        console.log(`Error:${error}`)
        setPageLoading(false);
      }
    };
    fetchAllConsultancies();
  }, []);

  const paginatedData = rowsPerPage > 0 ? allConsultancies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allConsultancies;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const CustomTablePagination = styled(TablePagination)` & .MuiTablePagination-toolbar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; background-color: #f9fafb; flex-wrap: wrap; } & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows { font-size: 14px; }`;

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {  
    try {
      // Fetch super admin details for deleting files
      setShowDeleting(true);
      const res = await fetch(`http://localhost:3000/api/consultancies/${deleteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) return;
      
      if (data.data.consultancy.photo_url.includes("firebase")) {
        const storage = getStorage();
        const desertRef = ref(storage, data.data.consultancy.photo_url);
        deleteObject(desertRef).catch(console.log);
      }

      const deleteRes = await fetch(`http://localhost:3000/api/consultancies/${deleteId}`, {
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
      setShowDeleting(false);
      console.log(error.message);
      setShowSuccess(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
          {allowWriteAccess && role === "admin" && (
            <div className="flex justify-end mb-5">
              <Link to={`/add-new-consultancy`} className="flex flex-row justify-center">
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                  Add New Consultancy
                </button>
              </Link>
            </div>
          )}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm md:text-[17px] text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                    Consultancy Name
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-30 md:w-50">
                    Website
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-26 md:w-34">
                    GST Number
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                    Head Office Address
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                    Branch Cities
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-48">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((consultancy, index) => (
                  <tr key={consultancy.id} className="border-b hover:bg-gray-50 transition text-gray-800">
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium w-8 md:w-12">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">{consultancy.name}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-30 md:w-50">
                      <a href={consultancy.website ? `https://${consultancy.website}` : ""} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {consultancy.website || "N/A"}
                      </a>
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-26 md:w-34">{consultancy.gst || "N/A"}</td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                      {/* {c.address} */}
                      { consultancy.office_details ?.find(o => o.office_type === "Head Office") ?.office_address || "—" }
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                      {/* {c.office_details.branches} */}
                      {consultancy.office_details?.map(o => o.office_city).join(", ")}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-48">
                      <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
                        <Link to={`/view-consultancy/${consultancy._id}`}>
                          <button className="bg-slate-500 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">View</button>
                        </Link>
                        {allowWriteAccess && role === "admin" && (
                          <>
                            <Link to={`/edit-consultancy/${consultancy._id}`}>
                              <button className="bg-[#1E293B] hover:bg-[#334155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">Edit</button>
                            </Link>
                            <button onClick={() => confirmDelete(consultancy._id)} className="bg-red-700 hover:bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
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
                          {rowsPerPage === -1 ? `1–${allConsultancies.length} of ${allConsultancies.length}` : `${Math.min(page * rowsPerPage + 1, allConsultancies.length)}–${Math.min( (page + 1) * rowsPerPage, allConsultancies.length )} of ${allConsultancies.length}`}
                        </span>
                        <button onClick={() => setPage(0)} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <FirstPageRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <ChevronLeftRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(allConsultancies.length / rowsPerPage) - 1))} disabled={page >= Math.ceil(allConsultancies.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <ChevronRightRoundedIcon fontSize="small" />
                        </button>
                        <button onClick={() => setPage(Math.ceil(allConsultancies.length / rowsPerPage) - 1)} disabled={page >= Math.ceil(allConsultancies.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                          <LastPageRoundedIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showConfirmDelete && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this consultancy?</p>
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
                <p className="text-[#334155]">Please hold on! The consultancy is being deleted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <p className="text-center font-medium text-xl mb-5">Congratulations, the consultancy details have been deleted successfully!</p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); window.location.reload(true); }}>
                OK
              </button>
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
                <p className="text-[#334155]">Please wait while we load the details of all superadmin.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}