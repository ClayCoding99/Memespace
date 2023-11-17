import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getAuthUser } from "../util/clientHTTPFunctions"; 

const UserContext = createContext();

export const UserProvider = ({children}) => {

    const {auth, authLoading} = useContext(AuthContext);
    
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function get() {
            console.log(authLoading);
            if (auth && !authLoading) {
                const response = await getAuthUser();
                if (response.user) {
                    setUser(prevUser => ({
                        ...prevUser,
                        ...response.user,
                    }));
                }
                setUserLoading(false);
            }
        }
        get();
    }, [auth, authLoading]);

    const contextValue = {user, setUser, userLoading};

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    ); 
}

export const useUser = () => {
    return useContext(UserContext);
}