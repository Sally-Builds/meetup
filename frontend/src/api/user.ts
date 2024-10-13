import API from "../axiosInstance";

export interface IUser {
    _id: string;
    full_name: string;
    username: string;
    dob: string;
    email: string;
    occupation: string;
    gender: "male" | "female";
    phone: string;
    interests: string[];
    is_verified: boolean;
    location: string;
    profile_image: { url: string, publicId: string };
    images: { url: string, publicId: string }[]
}

export interface IUpdateUserDTO {
    full_name?: string;
    occupation?: string;
    gender?: "male" | "female";
    interests?: string[];
    phone?: string;
    location?: string;
    dob?: string;
}

export interface ISignupDTO {
    full_name: string;
    email: string;
    dob: string;
    username: string;
    phone: string;
    occupation: string;
    gender: "male" | "female"
    password: string;
}

export const signup = async (data: ISignupDTO): Promise<{ token: string, user: IUser }> => {
    const res = await API.post('/auth/register', data, { headers: { "Content-Type": "application/json" }, withCredentials: true })
    localStorage.setItem('token', res.data.data.token)

    console.log(res.data.data)

    return res.data.data
}

export const login = async (data: { email: string, password: string }): Promise<{ token: string, user: IUser }> => {
    const res = await API.post('/auth/login', data, { headers: { "Content-Type": "application/json" }, withCredentials: true })
    localStorage.setItem('token', res.data.data.token)

    console.log(res.data.data)

    return res.data.data
}

export const getUser = async (): Promise<IUser> => {
    const token = localStorage.getItem('token')
    const res = await API.get('/users', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }, withCredentials: true
    });

    console.log(res.data.data)
    return res.data.data
}

export const uploadImage = async ({ type, form }: { form: FormData, type: "profile" | "images" }) => {
    const url = type == 'profile' ? "/users/upload-profile-image" : "/users/upload-images"
    const res = await API.post(url, form)

    console.log(res)

    return res.data
}

export const updateUser = async (data: IUpdateUserDTO) => {
    const res = await API.patch(`/users`, data)

    return res.data.data
}
