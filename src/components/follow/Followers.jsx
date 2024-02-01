import React, { useEffect, useState } from 'react'
import { UserList } from '../user/UserList'
import { Global } from '../../helpers/Global'
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Followers = () => {
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    const [userProfile, setUserProfile] = useState({});

    const params = useParams();

    const getUsers = async () => {
        setLoading(true);

        const userId = params.userId;

        const request = await fetch(Global.url + "/follows/followers/" + userId + "/" + page, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            }
        });

        const data = await request.json();

        var cleanUsers = [];

        console.log(data);

        data.followers.forEach(follow => {
            cleanUsers = [...cleanUsers, follow.user]
        });

        data.users = cleanUsers;

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
        GetProfile(params.userId, setUserProfile);
    }, [page]);

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Followers of {userProfile.username}</h1>
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
