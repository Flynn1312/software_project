import { Income } from "@/components/charts/income";
import { Saved } from "@/components/charts/saved";
import Link from "next/link"
import { Settings } from "lucide-react"
import { LogOut } from 'lucide-react';

export default function Home() {
  return (
    <main className = "Home">
      <Link href="/settings" className="absolute top-4 right-4">
      <Settings className="w-10 h-10" />
      </Link>
      <h1 className = "HomeHeading">Budget Tracker</h1> 
      <h1 className = "Welcome">Welcome User</h1>
      <div className = "home_section_format"> 
        <div className = "barchart">
        <Income/>
        </div> 
        <div>
        <Saved/>
        </div> 
      </div>
      <Link href="/login" className="absolute bottom-4 right-4">
      <LogOut className="w-10 h-10" />
      </Link>
    </main>
  );
} 
