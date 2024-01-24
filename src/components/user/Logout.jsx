import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';

export const Logout = () => {
    const { setAuth, setStats } = useAuth();

    useEffect(() => {
        localStorage.clear();

        setAuth({});
        setStats({});
    }, [])

    return (
        <h1>Logging out</h1>
    )
}
