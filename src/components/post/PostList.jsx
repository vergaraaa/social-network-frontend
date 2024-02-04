import React from 'react'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import { useAuth } from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../assets/img/user.png'

export const PostList = ({
    posts,
    getPosts,
    page,
    setPage,
    hasMore,
    setHasMore,
    userStats,
    setUserStats,
    user,
}) => {
    const { auth, stats, setStats } = useAuth();

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

    return (
        <>
            <div className="content__posts">
                {
                    posts.map(post => {
                        return (
                            <article key={post._id} className="posts__post">
                                <div className="post__container">
                                    <div className="post__image-user">
                                        <Link to={'/social/profile/' + post.user._id} className="post__image-link">
                                            {post.user.image !== "default.png" && <img src={Global.url + "/users/image/" + post.user.image} className="post__user-image" alt="Foto de perfil" />}
                                            {post.user.image === "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                        </Link>
                                    </div>
                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <Link to={'/social/profile/' + post.user._id} className="user-info__name">{post.user.name} {post.user.lastname}</Link>
                                            <span className="user-info__divider"> | </span>
                                            <Link to={'/social/profile/' + post.user._id} className="user-info__create-date">
                                                <ReactTimeAgo date={parseInt(post.created_at)} locale='en-EN' />
                                            </Link>
                                        </div>

                                        <h4 className="post__content">{post.text}</h4>

                                        {
                                            post.file && <img src={Global.url + "/posts/image/" + post.file} />
                                        }
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
