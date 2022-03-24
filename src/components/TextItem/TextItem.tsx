import React from "react";
import styles from './TextItem.module.css'
import {CrossSvg} from "../../assets/icons";

type TextItemProps = {
    itemId: string;
    content: string;
    onCloseButtonClick: (itemId: string) => void
}

const TextItem = ({itemId, content, onCloseButtonClick}: TextItemProps) => {

    return (
        <div className={styles.textItem} onClick={(event) => event.stopPropagation()}>
        <span>{content}</span>
            <button onClick={() => onCloseButtonClick(itemId)} className={styles.closeBtn}>
                <img alt='delete' src={CrossSvg}/>
            </button>
        </div>
    )
}

export default TextItem;