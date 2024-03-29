import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../assets/img/user.png'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

export const UserList = ({ users, following, setFollowing, loading, hasMore, page, setPage }) => {

    const { auth, stats, setStats } = useAuth();

    const follow = async (userId) => {
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
            setFollowing([...following, userId]);

            setStats({
                ...stats,
                following: stats.following + 1
            });
        }
    }

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + "/follows/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            let newFollowing = following.filter(follow => follow !== userId);

            setFollowing(newFollowing);

            setStats({
                ...stats,
                following: stats.following - 1
            });
        }
    }

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
    }

    return (
        <>
            <div className="content__posts">
                {
                    users.map(user => {
                        return (
                            <article key={user._id} className="posts__post">
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
                                            <Link to={'/social/profile/' + user._id} className="user-info__create-date">{user.username}</Link>
                                            <span className="user-info__divider"> | </span>
                                            <Link to={'/social/profile/' + user._id} className="user-info__create-date">
                                                <ReactTimeAgo date={user.created_at} locale='en-EN' />
                                            </Link>
                                        </div>

                                        <h4 className="post__content">{user.bio}</h4>
                                    </div>
                                </div>

                                {
                                    auth._id !== user._id &&
                                    <div className="post__buttons">
                                        {
                                            !following.includes(user._id)
                                                ? <button onClick={() => follow(user._id)} className="post__button post__button--green">
                                                    Follow
                                                </button>
                                                : <button onClick={() => unfollow(user._id)} className="post__button">
                                                    Unfollow
                                                </button>
                                        }

                                    </div>
                                }
                            </article>

                        )
                    })
                }
            </div>

            {loading && <h3>Loading...</h3>}

            {
                hasMore && (
                    <div className="content__container-btn">
                        <button className="content__btn-more-post" onClick={nextPage}>
                            More people
                        </button>
                    </div>
                )
            }
        </>
    )
}
