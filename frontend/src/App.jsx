import { Routes,Route } from "react-router-dom";
import Home from "./components/Home"
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useSelector } from "react-redux";



export default function App() {
  const user= useSelector(store=>store.auth.user)
  console.log("App Checkup :", user )
  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={user? <Home />:<Login/>}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
  
        
      </div>
    </>
  );
}
