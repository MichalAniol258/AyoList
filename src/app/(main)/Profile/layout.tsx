"use client"
import Nav from "../nav.jsx"
import ProfileHeader from "./profileHeader.jsx"
import ProfileMain from "./profileMain.jsx"
import NavPc from "../navPc.jsx"
import React from "react"



export default function DashboardLayout({ children }: { children: React.ReactNode }) {






  return (
    <div className="container1">
      <NavPc></NavPc>
      <ProfileHeader></ProfileHeader>
      <ProfileMain></ProfileMain>


      {children}


      <Nav></Nav>
    </div >
  );
}
