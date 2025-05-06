"use client"

import { useEffect, useState } from "react"
import { Income } from "@/components/charts/income"

export default function Page() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Function to get the current logged-in user
    async function getCurrentUser() {
      try {
        setLoading(true)

        // Try to get username from localStorage if available
        const storedUsername = localStorage.getItem("username")

        if (storedUsername) {
          console.log("Found user in localStorage:", storedUsername)
          setCurrentUser(storedUsername)
          setLoading(false)
          return
        }

        // If not in localStorage, try to get from cookies via a server action
        const checkLoginStatus = async () => {
          try {
            // This would be a server action that checks cookies
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

    // Set up event listener for login/logout events
    window.addEventListener("storage", (event) => {
      if (event.key === "username") {
        setCurrentUser(event.newValue)
      }
    })

    return () => {
      window.removeEventListener("storage", () => {})
    }
  }, [])

  if (loading) {
    return <div>Loading user data...</div>
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
    </div>
  )
}
