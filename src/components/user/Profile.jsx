import React, { useEffect, useState } from 'react'
import { PostList } from '../post/PostList'
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

            <PostList
                posts={posts}
                getPosts={getPosts}
                page={page}
                setPage={setPage}
                hasMore={hasMore}
                setHasMore={setHasMore}
                userStats={userStats}
                setUserStats={setUserStats}
                user={user}
            />
        </>
    )
}
