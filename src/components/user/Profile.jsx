import React from 'react'
import avatar from '../../assets/img/user.png'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'

export const Profile = () => {
    const { userId } = useParams();

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                        {/* {auth.image !== "default.png" && <img src={Global.url + "/users/image/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />} */}
                    </div>

                    <div className="general-info__container-names">
                        <p>
                            <h1 className="content__title">user name</h1>
                            <button className="content__button content__button--right">Follow</button>
                        </p>
                        {/* <Link to={'/social/profile/' + auth._id} className="container-names__name">{auth.name} {auth.lastname}</Link> */}
                        {/* <p className="container-names__nickname">{auth.username}</p> */}
                        <h2 className="container-names__nickname">auth.username</h2>
                        <p className="container-names__nickname">auth.bio</p>
                    </div>
                </div>

                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={"/social/following/" + userId} className="following__link">
                            <span className="following__title">Following</span>
                            {/* <span className="following__number">{stats.following}</span> */}
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={"/social/followers/" + userId} className="following__link">
                            <span className="following__title">Followers</span>
                            {/* <span className="following__number">{stats.followed}</span> */}
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={'/social/profile/' + userId} className="following__link">
                            <span className="following__title">Posts</span>
                            {/* <span className="following__number">{stats.posts}</span> */}
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
