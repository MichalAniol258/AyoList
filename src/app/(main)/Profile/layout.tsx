"use client"

import ProfileHeader from "./profileHeader.jsx"
import ProfileMain from "./profileMain.jsx"

import React from "react"



export default function DashboardLayout({ children }: { children: React.ReactNode }) {






  return (
    <div className="container1">

      <ProfileHeader></ProfileHeader>
      <ProfileMain></ProfileMain>


      {children}



    </div >
  );
}
