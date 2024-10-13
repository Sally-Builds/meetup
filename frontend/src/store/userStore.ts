import { create } from "zustand";
import { IUser } from "../api/user";

type UserStore = {
    loggedInUser: IUser | null
    setLoggedInUser: (data: IUser) => void
};


export const useUserStore = create<UserStore>((set) => ({
    loggedInUser: null,
    setLoggedInUser: (data) => {
        set(() => ({ loggedInUser: data }));
    },
}));