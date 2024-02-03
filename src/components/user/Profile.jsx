import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../assets/img/user.png'
import { Link, useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'

export const Profile = () => {
    const { auth, stats, setStats } = useAuth();
    const { userId } = useParams();

    const [user, setUser] = useState({});
    const [userStats, setUserStats] = useState({});
    const [iFollow, setIFollow] = useState(false);

    const getCounters = async () => {
        const request = await fetch(Global.url + '/users/stats/' + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            setUserStats({
                followed: data.followed,
                following: data.following,
                posts: data.posts,
            });
        }
    }

    const getDataUser = async () => {
        let dataUser = await GetProfile(userId, setUser);

        if (dataUser.following && dataUser.following._id) {
            setIFollow(true);
        }
    }

    const follow = async () => {
        const request = await fetch(Global.url + "/follows/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
            body: JSON.stringify({ followed: userId })
        });

        const data = await request.json();

        if (data.status === "success") {
            setIFollow(true);

            setStats({
                ...stats,
                following: stats.following + 1
            });

            setUserStats({
                ...userStats,
                followed: userStats.followed + 1,
            });
        }
    }

    const unfollow = async () => {
        const request = await fetch(Global.url + "/follows/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            setIFollow(false);

            setStats({
                ...stats,
                following: stats.following - 1
            });

            setUserStats({
                ...userStats,
                followed: userStats.followed - 1,
            });
        }
    }

    useEffect(() => {
        getDataUser();
        getCounters();
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
    }, [userId]);


    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image !== "default.png" && <img src={Global.url + "/users/image/" + user.image} className="container-avatar__img" alt="Foto de perfil" />}
                        {user.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <p>
                            <h1 className="content__title">{user.name} {user.lastname}</h1>
                            {
                                userId !== auth._id &&
                                (
                                    iFollow
                                        ? <button className="content__button content__button--right post__button" onClick={unfollow}>Unfollow</button>
                                        : <button className="content__button content__button--right" onClick={follow}>Follow</button>
                                )
                            }
                        </p>
                        <Link to={'/social/profile/' + user._id} className="container-names__name">{user.username}</Link>
                        <p className="container-names__nickname">{user.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={"/social/following/" + userId} className="following__link">
                            <span className="following__title">Following</span>
                            <span className="following__number">{userStats.following}</span>
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={"/social/followers/" + userId} className="following__link">
                            <span className="following__title">Followers</span>
                            <span className="following__number">{userStats.followed}</span>
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={'/social/profile/' + userId} className="following__link">
                            <span className="following__title">Posts</span>
                            <span className="following__number">{userStats.posts}</span>
                        </Link>
                    </div>
                </div>
            </header>


            <div className="content__posts">
                <article className="posts__post">
                    <div className="post__container">
                        <div className="post__image-user">
                            <a href="#" className="post__image-link">
                                <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                            </a>
                        </div>

                        <div className="post__body">

                            <div className="post__user-info">
                                <a href="#" className="user-info__name">Victor Robles</a>
                                <span className="user-info__divider"> | </span>
                                <a href="#" className="user-info__create-date">Hace 1 hora</a>
                            </div>

                            <h4 className="post__content">Hola, buenos dias.</h4>
                        </div>
                    </div>

                    <div className="post__buttons">
                        <a href="#" className="post__button">
                            <i className="fa-solid fa-trash-can"></i>
                        </a>
                    </div>
                </article>
            </div>

            <div className="content__container-btn">
                <button className="content__btn-more-post">
                    Ver mas publicaciones
                </button>
            </div>
        </>
    )
}
