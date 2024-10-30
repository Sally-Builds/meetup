import API from "../axiosInstance";

interface ProfileImage {
    url: string;
    publicId: string;
}

interface Participant {
    _id: string;
    username: string;
    profile_image: ProfileImage;
}

interface Message {
    senderId: string;
    content: string;
    timestamp: string; // Alternatively, Date can be used if dates are parsed
    status: 'unread' | 'read';
    _id: string;
}

export interface IChat {
    _id: string;
    participants: Participant[];
    messages: Message[];
    createdAt: string; // Use Date if the timestamp is parsed into a Date object
    updatedAt: string;
    __v: number;
    unreadMessageCount: number;
}


export const getAllChat = async (): Promise<IChat[]> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/chat/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    return res.data.data
}

export const getUnreadCount = async (): Promise<number> => {
    console.log('called')
    const token = localStorage.getItem('token')
    const res = await API.get(`/chat/unread`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    return res.data.count
}