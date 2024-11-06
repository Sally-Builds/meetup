import API from "../axiosInstance";

interface ISender {
    full_name: string;
    profile_image: {
        url: string;
        publicId: string;
    },
    username: string;
    _id: string;
}


export interface IRequest {
    sender: ISender;
    status: "pending" | "accepted" | "rejected"
    _id: string
}

interface IProfileImage {
    url: string;
    publicId: string;
}

interface IUser {
    _id: string;
    profile_image: IProfileImage;
    full_name: string;
    username: string;
}

interface IMainRequest {
    _id: string;
    sender: IUser;
    receiver: IUser;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;  // ISO date format
    __v: number;
}

export const sendRequest = async (friendId: string) => {
    const token = localStorage.getItem('token')
    const res = await API.post(`/users/${friendId}/requests`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    console.log(res.data)
    return res.data.data
}

export const getRequests = async (): Promise<IRequest[]> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/requests`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    return res.data.data.requests
}

export const getPendingCount = async (): Promise<{ count: number }> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/requests/count`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    return { count: res.data.data }
}

export const getConnections = async (): Promise<{ connections: IMainRequest[], length: number }> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/requests/connections`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    console.log(res.data.data, 'my connections')
    return res.data.data
}

export const updateRequest = async ({ requestId, status }: { requestId: string, status: "accepted" | "rejected" }) => {
    const token = localStorage.getItem('token')
    const res = await API.patch(`/requests/${requestId}?status=${status}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    console.log(res.data.data, 'from updating request')
    return res.data.data
}