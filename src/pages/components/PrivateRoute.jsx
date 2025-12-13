// import { useSelector } from 'react-redux';
// import { Outlet, Navigate } from 'react-router-dom';

// export default function PrivateRoute() {
//   const {currentUser} = useSelector((state) => state.user);
  
//   return currentUser ? <Outlet /> : <Navigate to="/super-admin-login" />
// }
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate to="/super-admin-login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
