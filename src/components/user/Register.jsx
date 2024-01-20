import React from 'react'
import { useForm } from '../../hooks/useForm'

export const Register = () => {

    const { form, changed } = useForm();

    const registerUser = (e) => {
        e.preventDefault();

        let newUser = form;
    }

    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>Register</h1>
            </header>

            <div className="content__posts">
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
