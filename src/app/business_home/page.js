import { Income } from "@/components/charts/income";
import { Saved } from "@/components/charts/saved";

export default function Home() {
  return (
    <main className = "Home">
      <h1 className = "HomeHeading">Budget Tracker</h1>
      <h1 className = "Welcome">Welcome Company</h1>
      <div className = "home_section_format"> 
        <div className = "barchart">
        <Income/>
        </div> 
        <div>
        <Saved/>
        </div> 
      </div>
    </main>
  );
} 