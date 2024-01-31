import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'
import { useForm } from '../../../hooks/useForm'
import avatar from '../../../assets/img/user.png'

export const Sidebar = () => {

    const { auth, stats, setStats } = useAuth();
    const { form, changed } = useForm({});
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState('pure');


    const savePost = async (e) => {
        e.preventDefault();

        let newPost = form;
        newPost.user = auth._id;

        const token = localStorage.getItem("token");

        const request = await fetch(Global.url + "/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(newPost),
        });

        const data = await request.json();

        if (data.status === "success") {
            setStatus("success");

            setStats({
                ...stats,
                posts: stats.posts + 1
            });
        }
        else {
            setStatus("failure");
            setMessage(data.message);
        }

        // upload image
        const fileInput = document.querySelector("#file");

        if (data.status === "success" && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            const uploadRequest = await fetch(Global.url + "/posts/upload-image/" + data.post._id, {
                method: "POST",
                headers: {
                    "Authorization": token,
                },
                body: formData
            });

            const uploadData = await uploadRequest.json()

            if (uploadData.status === "success") {
                setStatus("success");


            }
            else {
                setStatus("failure");
                setMessage(uploadData.message);
            }

            if (data.status === "success" && uploadData.status === "success") {
                const form = document.querySelector("#post-form");
                form.reset();
            }
        }
    }

    return (
        <aside className="layout__aside">
            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">
                <div className="aside__profile-info">
                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image !== "default.png" && <img src={Global.url + "/users/image/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{auth.name} {auth.lastname}</a>
                            <p className="container-names__nickname">{auth.username}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">
                        <div className="stats__following">
                            <Link to={"/social/following/" + auth._id} className="following__link">
                                <span className="following__title">Following</span>
                                <span className="following__number">{stats.following}</span>
                            </Link>
                        </div>

                        <div className="stats__following">
                            <Link to={"/social/followers/" + auth._id} className="following__link">
                                <span className="following__title">Followers</span>
                                <span className="following__number">{stats.followed}</span>
                            </Link>
                        </div>

                        <div className="stats__following">
                            <a href="#" className="following__link">
                                <span className="following__title">Posts</span>
                                <span className="following__number">{stats.posts}</span>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="aside__container-form">
                    {status === "success" && <strong className='alert alert-success'>Post uploaded successfully</strong>}
                    {status === "failure" && <strong className='alert alert-danger'>{message}</strong>}

                    <form id='post-form' className="container-form__form-post" onSubmit={savePost}>
                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">¿Whats on your mind today?</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed} />
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="file" className="form-post__label">Sube tu foto</label>
                            <input type="file" id='file' name="file" className="form-post__image" />
                        </div>

                        <input type="submit" value="Upload" className="form-post__btn-submit" />
                    </form>
                </div>
            </div>
        </aside>
    )
}
