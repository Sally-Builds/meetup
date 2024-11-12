import { create } from "zustand";
import { IUser } from "../api/user";
import { IRequest } from "../api/request";

type UserStore = {
    loggedInUser: IUser | null
    setLoggedInUser: (data: IUser) => void
    removeLoggedInUser: () => void
    friendRequests: IRequest[]
};


export const useUserStore = create<UserStore>((set) => ({
    loggedInUser: null,
    setLoggedInUser: (data) => {
        set(() => ({ loggedInUser: data }));
    },
    removeLoggedInUser: () => {
        set(() => ({ loggedInUser: null }));
    },
    friendRequests: []
}));