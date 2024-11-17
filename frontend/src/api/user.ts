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
    images: { url: string, publicId: string }[];
    similarityScore: number;
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

export const isEmailExist = async (data: { email: string }): Promise<boolean> => {
    const res = await API.post('/auth/is-email', data, { headers: { "Content-Type": "application/json" }, withCredentials: true })

    console.log(res.data.data)

    return res.data.data.isEmail
}

export const isUsernameExist = async (data: { username: string }): Promise<boolean> => {
    const res = await API.post('/auth/is-username', data, { headers: { "Content-Type": "application/json" }, withCredentials: true })

    console.log(res.data.data)

    return res.data.data.isUsername
}

export const logout = async () => {
    await API.get('/auth/logout', { headers: { "Content-Type": "application/json" }, withCredentials: true })
    localStorage.removeItem('token')
}

export const getUser = async (): Promise<IUser> => {
    const token = localStorage.getItem('token')
    const res = await API.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }, withCredentials: true
    });

    console.log(res.data.data)
    return res.data.data
}

export const getAllUsers = async (): Promise<IUser[]> => {
    const token = localStorage.getItem('token')
    const res = await API.get('/users', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }, withCredentials: true
    });

    const res2 = await API.get('/users/similar-interests', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }, withCredentials: true
    });

    console.log(res2.data.data, 'similar interests')

    console.log(res.data.data)
    return res2.data.data
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


export const updatePassword = async (data: { oldPassword: string, newPassword: string }): Promise<{ token: string, user: IUser }> => {
    const res = await API.patch('/auth/update-password', data, { headers: { "Content-Type": "application/json" }, withCredentials: true })
    localStorage.setItem('token', res.data.data.token)

    console.log(res.data.data)

    return res.data.data
}