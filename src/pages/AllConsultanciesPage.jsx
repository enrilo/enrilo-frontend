import { useState } from "react";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function AllConsultanciesPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const consultancies = [
    {
      id: 1,
      name: "ABX Consultancy",
      website: "abxconsulting.in",
      gst: "ABC1234",
      address: "Vadodara, India",
      branches: "Vadodara, Bhavnagar",
    }, {
      id: 2,
      name: "AdmidTech",
      website: "admidtech.com",
      gst: "ABC4321",
      address: "Ahmedabad, India",
      branches: "Ahmedabad",
    }, {
      id: 3,
      name: "RK Desai Consulting",
      website: "rkdesaiconsulting.com",
      gst: "1234ABCD",
      address: "Rajkot, India",
      branches: "Rajkot",
    }, {
      id: 4,
      name: "Emaar Consultancy",
      website: "emaarconsulting.com",
      gst: "ABCD1234",
      address: "Dubai, UAE",
      branches: "Dubai, Sharjah",
    }, {
      id: 5,
      name: "Trump Consultancy",
      website: "trumpconsulting.com",
      gst: "EFGH9971",
      address: "New York City, USA",
      branches: "New York City",
    }, {
      id: 6,
      name: "J&J Education",
      website: "jjeducation.com",
      gst: "ES9284FF",
      address: "London, UK",
      branches: "London, Leicester",
    }, {
      id: 7,
      name: "SOSA Admissions",
      website: "sosaadmissions.com",
      gst: "XY2P9Z00",
      address: "Sydney, Australia",
      branches: "Sydney, Adelaide",
    },
  ];

  const paginatedData = rowsPerPage > 0 ? consultancies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : consultancies;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const CustomTablePagination = styled(TablePagination)` & .MuiTablePagination-toolbar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; background-color: #f9fafb; flex-wrap: wrap; } & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows { font-size: 14px; }`;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm md:text-[17px] text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">
                  Consultancy Name
                </th>
                <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                  Website
                </th>
                <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">
                  GST Number
                </th>
                <th className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-60">
                  Address
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
              {paginatedData.map((c, index) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition text-gray-800">
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium">
                    {page * rowsPerPage + index + 1}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">{c.name}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {c.website}
                    </a>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">{c.gst}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    {c.address}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    {c.branches}
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                      <button className="bg-slate-500 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                        View
                      </button>
                      <button className="bg-slate-800 hover:bg-slate-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                        Edit
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <CustomTablePagination rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]} colSpan={7} count={consultancies.length} rowsPerPage={rowsPerPage} page={page}
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
      </div>
    </div>
  );
}