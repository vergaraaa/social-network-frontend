import React, { useState, useEffect, createContext } from 'react'
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);

            return false;
        }

        const userObj = JSON.parse(user);
        const userId = userObj._id;

        const request = await fetch(Global.url + "/users/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            }
        });

        const data = await request.json();

        const requestStats = await fetch(Global.url + "/users/stats/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            }
        });


        const dataCounters = await requestStats.json();

        setAuth(data.user);
        setStats(dataCounters);
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            stats,
            setStats,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;