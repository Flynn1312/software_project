"use client"

import { useEffect, useState } from "react"
import { Income } from "@/components/charts/income"
import { logout } from "@/actions/logout"
import { LogOut } from 'lucide-react';
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import Link from "next/link";

export default function Page() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Function to get the current user
    async function getCurrentUser() {
      try {
        setLoading(true)

        // Try to get username from localStorage
        const storedUsername = localStorage.getItem("username")

        if (storedUsername) {
          console.log("Found user in localStorage:", storedUsername)
          setCurrentUser(storedUsername)
          setLoading(false)
          return
        }

        // try to get from cookies via a server action
        const checkLoginStatus = async () => {
          try {
            const response = await fetch("/api/current-user")
            if (response.ok) {
              const data = await response.json()
              if (data.username) {
                console.log("Found user from API:", data.username)
                localStorage.setItem("username", data.username)
                setCurrentUser(data.username)
              } else {
                console.log("No user found from API")
                setCurrentUser(null)
              }
            }
          } catch (error) {
            console.error("Error checking login status:", error)
          } finally {
            setLoading(false)
          }
        }

        checkLoginStatus()
      } catch (error) {
        console.error("Error getting current user:", error)
        setLoading(false)
      }
    }

    getCurrentUser()

    window.addEventListener("storage", (event) => {
      if (event.key === "username") {
        setCurrentUser(event.newValue)
      }
    })

    return () => {
      window.removeEventListener("storage", () => {})
    }
  }, [])

  const handleLogout = async () => {
    try {
      
      const result = await logout()

      localStorage.removeItem("username")
      
      setCurrentUser(null)
      
      console.log("Logout successful, redirecting to login page");
      
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading user data...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {currentUser ? (
        <>
          <p className="mb-4">
            Logged in as: <strong>{currentUser}</strong>
          </p>
          <Income userId={currentUser} />
        </>
      ) : (
        <p>Please log in to view your income data</p>
      )}
      <Link href="/settings" className="absolute top-4 right-4">
      <Settings className="w-10 h-10" />
      </Link>
      <LogOut className="w-10 h-10 absolute bottom-4 right-4" onClick={handleLogout} />
    </div>
  )
}