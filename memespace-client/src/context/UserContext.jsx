import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getUser } from "../util/clientHTTPFunctions"; 

const UserContext = createContext();

export const UserProvider = ({children}) => {

    const {auth} = useContext(AuthContext);
    
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function get() {
            if (auth) {
                const response = await getUser();
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
    }, [auth]);

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