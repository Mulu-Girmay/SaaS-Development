import { createContext,useState, useContext } from "react";
export const AuthContext = createContext();
export const AuthProvider =({children})=>{
  const [auth, setAuth]= useState(JSON.parse(localStorage.getItem("auth"))|| null)
  const login = (data)=>{
    setAuth(data);
    localStorage.setItem("auth",JSON.stringify(data))
  }
  const logout = ()=>{
    setAuth(null);
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider value={{auth , login , logout}}>{children}</AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext);
