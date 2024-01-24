import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
    const { setAuth } = useAuth();

    const { form, changed } = useForm();
    const [status, setStatus] = useState("pure");
    const [message, setMessage] = useState("");

    const login = async (e) => {
        e.preventDefault();

        let credentials = form;

        const request = await fetch(Global.url + '/users/login', {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setStatus("success");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));


            setTimeout(() => {
                setAuth(data.user);

                window.location.reload();
            }, 1000);
        }
        else {
            setStatus("failure");
            setMessage(data.message);
        }
    }


    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>Login</h1>
            </header>

            <div className="content__posts">
                {status === "success" && <strong className='alert alert-success'>User logged in</strong>}
                {status === "failure" && <strong className='alert alert-danger'>{message}</strong>}

                <form className="form-login" onSubmit={login}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={changed} />
                    </div>

                    <input type="submit" value="Login" className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
