export type UserType = {
    id: string;
    username: string;
    disabled?: boolean;
}

export type FriendType = UserType & {
    checked: boolean;
}