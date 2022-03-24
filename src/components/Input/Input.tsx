import React, {useRef} from "react";
import styles from './Input.module.css'
import {TextItem} from "../TextItem";
import {FriendType} from "../../types";

type InputProps = {
    list: FriendType[];
    onDisableFriend: (itemId: string) => void;
    onInput: (text: string) => void;
    getInputIsFocused: (isFocused: boolean) => void;
}

const Input = ({list, onDisableFriend, onInput, getInputIsFocused}: InputProps) => {
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = useRef<HTMLInputElement>(null)

    const backspaceClickHandler = () => {
        if (list.length && inputValue === '') {
            onDisableFriend(list[list.length - 1].id);
        }
    }

    const handleChangeInputValue = (value: string) => {
        setInputValue(value);
        onInput(value)
    }

    return (
        <div className={styles.fieldWrapper} onClick={() => inputRef.current?.focus()}>
            {list.map(listItem =>
                <TextItem
                    key={listItem.id}
                    itemId={listItem.id}
                    onCloseButtonClick={onDisableFriend}
                    content={listItem.username}
                />)}
            <input
                autoFocus
                ref={inputRef}
                value={inputValue}
                onChange={(event) => {
                    getInputIsFocused(true);
                    handleChangeInputValue(event.target.value);
                }}
                className={styles.input}
                onKeyDown={(event) =>
                    event.key === 'Backspace' && backspaceClickHandler()
                }
                onFocus={() => {
                    getInputIsFocused(true);
                    handleChangeInputValue('');
                }}
                onClick={() => getInputIsFocused(true)}
            />
        </div>
    )
}

export default Input;