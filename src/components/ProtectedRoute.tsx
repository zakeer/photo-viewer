"use client"

import { useAuth } from "@/context/AuthContext"
import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login")
    }
  }, [currentUser, loading, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return currentUser ? <>{children}</> : null
}

export default ProtectedRoute

