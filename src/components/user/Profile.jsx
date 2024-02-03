import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../assets/img/user.png'
import { Link, useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'

export const Profile = () => {
    const { userId } = useParams();
    const { auth, stats, setStats } = useAuth();

    const [page, setPage] = useState(1);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [iFollow, setIFollow] = useState(false);
    const [userStats, setUserStats] = useState({});


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

    const getPosts = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + '/posts/user/' + userId + '/' + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            let newPosts = data.posts;

            if (newProfile) {
                setHasMore(true);
                setPage(1);
            }
            else {
                newPosts = [...posts, ...data.posts];
            }

            setPosts(newPosts);

            if (newPosts.length >= data.total) {
                setHasMore(false);
            }

            if (data.pages <= 1) {
                setHasMore(false);
            }

        }
    }

    const deletePost = async (postId) => {
        const request = await fetch(Global.url + '/posts/delete/' + postId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            setPage(1);
            setHasMore(true);
            await getPosts(1, true);

            setStats({
                ...stats,
                posts: stats.posts - 1
            });

            setUserStats({
                ...userStats,
                posts: userStats.posts - 1,
            });
        }
    }

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPosts(next);
    }

    useEffect(() => {
        getDataUser();
        getCounters();
        getPosts(1, true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
        setHasMore(true);
        getPosts(1, true);
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
                {
                    posts.map(post => {
                        return (
                            <article key={post._id} className="posts__post">
                                <div className="post__container">
                                    <div className="post__image-user">
                                        <Link to={'/social/profile/' + user._id} className="post__image-link">
                                            {user.image !== "default.png" && <img src={Global.url + "/users/image/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                            {user.image === "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                        </Link>
                                    </div>
                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <Link to={'/social/profile/' + user._id} className="user-info__name">{user.name} {user.lastname}</Link>
                                            <span className="user-info__divider"> | </span>
                                            <Link to={'/social/profile/' + user._id} className="user-info__create-date">Hace 1 hora</Link>
                                        </div>

                                        <h4 className="post__content">{post.text}</h4>
                                    </div>
                                </div>

                                {
                                    auth._id === post.user._id &&
                                    <div className="post__buttons">
                                        <button onClick={() => deletePost(post._id)} className="post__button">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                }
                            </article>
                        )
                    })
                }
            </div>

            {
                hasMore && (
                    <div className="content__container-btn">
                        <button className="content__btn-more-post" onClick={nextPage}>
                            Show more posts
                        </button>
                    </div>
                )
            }
        </>
    )
}
