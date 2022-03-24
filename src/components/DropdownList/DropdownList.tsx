import React, {KeyboardEvent, useState} from "react";
import {FriendType} from "../../types";
import styles from './DropdownList.module.css'

type DropdownListProps = {
    list: FriendType[];
    onListItemCheck: (itemId: string) => void;
    filterString: string;
}

const DropdownList = React.forwardRef<HTMLUListElement, DropdownListProps>((
    {list, onListItemCheck, filterString}: DropdownListProps,
    ref) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(-1);

    const filteredList = list.filter(listItem => {
        const {username} = listItem;

        return username.toUpperCase().includes(filterString.toUpperCase().trim())
    })

    const handleKeyboardEvents = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' && currentItemIndex < filteredList.length - 1) {
            setCurrentItemIndex(index => index + 1);
        }

        if (event.key === 'ArrowUp' && currentItemIndex > 0) {
            setCurrentItemIndex(index => index - 1)
        }

        if (event.key === 'Enter' || event.code === 'Space') {
            onListItemCheck(filteredList[currentItemIndex].id)
        }
    }

    const getClassName = (checked: boolean, hovered: boolean) => {
        const classNamesArray = [styles.dropdownListItem]

        if (checked) {
            classNamesArray.push(styles.checked)
        }

        if (hovered) {
            classNamesArray.push(styles.hovered)
        }

        return classNamesArray.join(' ')
    }

    return (
        <ul
            ref={ref}
            tabIndex={0}
            className={styles.dropdownList}
            onFocus={() => setCurrentItemIndex(0)}
            onBlur={() => setCurrentItemIndex(-1)}
            onKeyDown={handleKeyboardEvents}
        >
            {filteredList.length ? (
                <>
                    {filteredList.map((listItem, index) => {
                            const {checked, username, id} = listItem;

                            return (
                                <li onClick={() => {
                                    onListItemCheck(id)
                                    setCurrentItemIndex(index)
                                }}
                                    key={listItem.id}
                                    className={getClassName(checked, index === currentItemIndex)}>
                                    {username}
                                </li>)
                        }
                    )
                    }
                </>
            ) : <span>Nothing was found</span>}
        </ul>
    )
})

export default DropdownList;