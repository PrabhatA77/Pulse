import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes"
import { useAuthStore } from "./store/authStore"
const App = () => {

  const checkAuth = useAuthStore((s)=>s.checkAuth);
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  return (
    <div className="dark:bg-[#0e1316]">
      <AppRoutes/>
    </div>
  )
}

export default App