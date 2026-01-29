import React, {useState, createContext} from "react";

export const AuthContext = createContext();// creating the context

export const AuthProvider = ({children}) => {//I  have changed the name as AuthProvider  from AuthToken
    const [authToken, setAuthToken]  = useState(null);

    const login = (token) =>{
        setAuthToken(token);
    }
    
    const logout =(token) =>{
        setAuthToken(null);
    }
    return(
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider