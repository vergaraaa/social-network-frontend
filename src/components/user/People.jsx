import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
export const People = () => {

    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);

    const getUsers = async () => {
        setLoading(true);

        const request = await fetch(Global.url + "/users/list/" + page, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            }
        });

        const data = await request.json();


        if (data.users && data.status === "success") {
            let newUsers = [...users, ...data.users];

            setUsers(newUsers);
            setFollowing(data.userFollowing);

            if (newUsers.length >= data.total) {
                setHasMore(false);
            }
        }

        setLoading(false);
    };

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
    }

    useEffect(() => {
        getUsers();
    }, [page]);

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">People</h1>
            </header>

            <div className="content__posts">
                {
                    users.map(user => {
                        return (
                            <article key={user.id} className="posts__post">
                                <div className="post__container">
                                    <div className="post__image-user">
                                        <a href="#" className="post__image-link">
                                            {user.image !== "default.png" && <img src={Global.url + "/users/image/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                            {user.image === "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                        </a>
                                    </div>

                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <a href="#" className="user-info__name">{user.name} {user.lastname}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date">{user.username}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date">{user.created_at}</a>
                                        </div>

                                        <h4 className="post__content">{user.bio}</h4>
                                    </div>
                                </div>

                                <div className="post__buttons">
                                    {
                                        !following.includes(user.id)
                                            ? <a href="#" className="post__button post__button--green">
                                                Follow
                                            </a>
                                            : <a href="#" className="post__button">
                                                Unfollow
                                            </a>
                                    }

                                </div>
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
