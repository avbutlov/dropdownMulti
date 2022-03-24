import React, {useEffect, useMemo, useState} from 'react';
import styles from './App.module.css'
import {UserType} from "../../types";
import {Dropdown} from "../Dropdown";

const App = () => {
    const [users, setUsers] = useState<UserType[]>([]);

    const disabledUsers = useMemo(() => users.filter(user => user.disabled), [users]) || [];
    const enabledUsers = useMemo(() => users.filter(user => !user.disabled), [users]) || [];

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then<UserType[]>(response => response.json())
            .then(json => {
                const mappedUsers = json.map((user, id) => {
                    return id === 0 ? {...user, disabled: false} : {...user, disabled: true};
                })

                return setUsers(mappedUsers);
            })
    }, [])

    const addUser = () => {
        const foundUser = disabledUsers[0];

        const listWithNewUser = users.map((user) => {
            return user.id === foundUser.id ? {...foundUser, disabled: false} : user
        })

        setUsers(listWithNewUser);
    }

    const deleteUser = (userId: string) => {
        const userForDelete = users.find(user => user.id === userId);

        const filteredEnabledUsers = enabledUsers.filter(user => user.id !== userId);

        userForDelete &&
            setUsers(
                [...filteredEnabledUsers, {...userForDelete, disabled: true}, ...disabledUsers]
            );
    }

    return (
        <div className={styles.app}>
            <h1>Friends List Dropdown</h1>
            {users.length ? (
                <>
                    {
                        enabledUsers.map((user) =>
                            <Dropdown
                                key={user.id}
                                isDeleteButtonHidden={enabledUsers.length <= 1}
                                onDeleteHandler={deleteUser}
                                currentUser={user}
                                userList={users}
                            />
                        )
                    }

                    <button disabled={!disabledUsers.length}
                            className={styles.addBtn}
                            onClick={addUser}>
                        {'add new user'.toUpperCase()}
                    </button>
                </>
            ) : <h2>Loading...</h2>}
        </div>
    );
};

export default App;