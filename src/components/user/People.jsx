import React, { useEffect, useState } from 'react'
import { UserList } from './UserList'
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

    useEffect(() => {
        getUsers();
    }, [page]);

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">People</h1>
            </header>

            <UserList
                users={users}
                setUsers={setUsers}
                following={following}
                setFollowing={setFollowing}
                hasMore={hasMore}
                loading={loading}
                page={page}
                setPage={setPage}
            />
        </>
    )
}
