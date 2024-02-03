import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { PostList } from './PostList'
import { useAuth } from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { Link } from 'react-router-dom'

export const Feed = () => {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const getPosts = async (next) => {
        const request = await fetch(Global.url + '/posts/feed/' + next, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        if (data.status === "success") {
            let newPosts = [...posts, ...data.posts];

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
        getPosts();
    }, []);


    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button">Mostrar nuevas</button>
            </header>

            <PostList
                posts={posts}
                getPosts={getPosts}
                page={page}
                setPage={setPage}
                hasMore={hasMore}
                setHasMore={setHasMore}
            />
        </>
    )
}
