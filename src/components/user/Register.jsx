import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';

export const Register = () => {

    const { form, changed } = useForm();
    const [status, setStatus] = useState("pure");
    const [message, setMessage] = useState("");

    const registerUser = async (e) => {
        e.preventDefault();

        let newUser = form;

        const request = await fetch(Global.url + '/users/register', {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setStatus("success");
        }
        else {
            setStatus("failure");
            setMessage(data.message);
        }
    }

    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>Register</h1>
            </header>

            <div className="content__posts">
                {status === "success" && <strong className='alert alert-success'>User registered successfully</strong>}
                {status === "failure" && <strong className='alert alert-danger'>{message}</strong>}

                <form className='register-form' onSubmit={registerUser}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" name="lastname" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={changed} />
                    </div>

                    <input type="submit" value="Register" className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
