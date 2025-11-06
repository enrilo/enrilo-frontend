import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const {currentUser} = useSelector((state) => state.user);
  console.log(`${JSON.stringify(currentUser, null, 2)}`);
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />
}
