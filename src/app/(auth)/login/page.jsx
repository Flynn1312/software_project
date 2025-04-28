"use client"
import { useRouter } from "next/navigation"
import { title } from "process"

export default function SignInRoute() {

    const router = useRouter()

    const handleButton = () => {
        router.push("/")
    }

    return (
        <div>
            Sign In Route
            <h1>
                Login Page
            </h1>
            <button onClick={handleButton}>
                Home
            </button>
        </div>
    )
} 
const config = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };