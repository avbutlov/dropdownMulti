import React, {KeyboardEvent, useEffect, useRef, useState} from "react";
import {FriendType, UserType} from "../../types";
import styles from './Dropdown.module.css'
import {Input} from "../../components/Input";
import {DropdownList} from "../../components/DropdownList";
import {CrossSvg} from "../../assets/icons";
import {isElementInViewport} from "../../helpers/isElementInViewport";

type DropdownProps = {
    currentUser: UserType;
    userList: UserType[];
    onDeleteHandler: (id: string) => void;
    isDeleteButtonHidden?: boolean;
}

const Dropdown = ({currentUser, userList, onDeleteHandler, isDeleteButtonHidden}: DropdownProps) => {
    const [friendList, setFriendList] = useState<FriendType[]>([]);
    const [textInputList, setTextInputList] = useState<FriendType[]>([]);
    const [filterString, setFilterString] = useState('');
    const [isDropdownListOpened, setIsDropdownListOpened] = useState(false);

    const dropdownListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const mappedUserList = userList
            .filter(user => user.id !== currentUser.id)
            .map(user => ({...user, checked: false}))

        setFriendList(mappedUserList)
    }, [])

    useEffect(() => {
        if (dropdownListRef.current && !isElementInViewport(dropdownListRef.current)) {
            dropdownListRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [isDropdownListOpened])

    const textInputInteractHandler = (listItemId: string) => {
        const currentListItem = friendList.find(friend => friend.id === listItemId);

        if (currentListItem?.checked) {
            return setTextInputList(textInputList.filter(listItem => listItem.id !== listItemId));
        }

        return currentListItem && setTextInputList([...textInputList, {...currentListItem, checked: true}])
    }

    const itemClickHandler = (friendId: string) => {
        textInputInteractHandler(friendId)
        const transformedFriendList = friendList.map(friend => {
            if (friend.id === friendId) {
                return friend.checked ? {...friend, checked: false} : {...friend, checked: true}
            }
            return friend
        })

        setFriendList(transformedFriendList);
    }

    const getFilterString = (inputValue: string) => setFilterString(inputValue);

    const switchDropdownListVisibility = (isVisible: boolean) => setIsDropdownListOpened(isVisible)

    const keyboardEventsHandler = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'Escape':
                return setIsDropdownListOpened(false);

            case 'ArrowDown':
                event.preventDefault();
                return dropdownListRef.current?.focus();

            case 'ArrowUp':
                return event.preventDefault();

            default:
                return null
        }
    }

    return (
        <div
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsDropdownListOpened(false)
                }
            }}
            className={styles.dropdown}
            onKeyDown={keyboardEventsHandler}
        >
            <h2>{currentUser.username}'s friends</h2>
            <div className={styles.inputContainer}>
                <Input getInputIsFocused={switchDropdownListVisibility} onInput={getFilterString}
                       onDisableFriend={itemClickHandler} list={textInputList}/>
                <button className={isDeleteButtonHidden ? styles.hidden : ''}
                        onClick={() => onDeleteHandler(currentUser.id)}>
                    <img alt='delete' src={CrossSvg}/>
                </button>
            </div>
            {isDropdownListOpened &&
            <DropdownList
                ref={dropdownListRef}
                onListItemCheck={itemClickHandler}
                list={friendList}
                filterString={filterString}
            />
            }
        </div>
    )
}

export default Dropdown;