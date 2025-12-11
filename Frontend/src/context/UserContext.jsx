import React, {createContext, useEffect,useState} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) return
        const accessToken = localStorage.getItem('token')
        if(!accessToken){
            setLoading(false)
            return;
        }
        const fetchUser = async() => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                setUser(response.data)
            }
            catch(error){
                console.error("User not authenticated", error)
                clearUser()
            }
            finally{
                setLoading(false)
            }
        };
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        // Handle different response structures:
        // 1. {token: "...", user: {...}} structure
        // 2. Direct user object structure
        if (userData.token && userData.user) {
            // Structure: {token: "...", user: {...}}
            setUser(userData.user);
            localStorage.setItem('token', userData.token);
        } else if (userData.token) {
            // Structure: {token: "...", ...otherUserProps}
            const { token, ...userWithoutToken } = userData;
            setUser(userWithoutToken);
            localStorage.setItem('token', token);
        } else {
            // Structure: just user object without token
            setUser(userData);
        }
        setLoading(false);
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    }
    
    return (
        <UserContext.Provider value = {{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;