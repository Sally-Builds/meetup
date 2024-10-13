import API from "../axiosInstance";


export interface IEvent {
    name: string;
    activities: string[]
    description: string;
    date: Date;
    location: string;
    expected_attendees: number;
    cover_image: { url: string, publicId: string };
    user: string,
    slug: string,
    _id: string,
}

export const createEvent = async (formData: FormData) => {
    const token = localStorage.getItem('token')
    console.log(formData.get('cover_image'), 'from api')
    const res = await API.post(`/events/`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    return res.data.data
}


export const getEvents = async (): Promise<{ length: number, total: number, events: IEvent[] }> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/events/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    console.log(res.data.data, 'events')

    return res.data.data
}


export const fetchEvent = async (slug: string): Promise<IEvent> => {
    const token = localStorage.getItem('token')
    const res = await API.get(`/events/${slug}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }, withCredentials: true
    })

    console.log(res.data.data, 'events')

    return res.data.data
}
