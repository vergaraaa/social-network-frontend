import React from 'react'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { Feed } from '../components/post/Feed'
import { AuthProvider } from '../context/AuthProvider'
import { Logout } from '../components/user/Logout'

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='register' element={<Register />} />
                    </Route>

                    <Route path='/social' element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>

                    <Route path='*' element={
                        <>
                            <p>
                                <h1>Error 404</h1>
                                <Link to="/">Back to Home</Link>
                            </p>
                        </>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
