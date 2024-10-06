import Event, { IEvent } from "../models/Event";
import { uploadImage } from "../utils/cloudinary";
import { CustomError } from "../utils/customError";
import { IFileBuffer } from "../utils/interfaces";


export const createEvent = async (userId: string, payload: IEvent, file: IFileBuffer) => {
    const ProfileImageResult = await uploadImage(file.buffer)
    const cover_image = { url: (ProfileImageResult as any).secure_url, publicId: (ProfileImageResult as any).public_id }

    const event = await Event.create({ ...payload, user: userId, cover_image });

    return event
}

export const getEvents = async (query: any) => {
    const queryObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach((el: string) => delete queryObj[el])


    //Advanced Filter
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const parsedQueryObj = JSON.parse(queryStr);

    // const defaultFilter = { stock: { $gt: 0 } };

    let queryBuilder = Event.find({ ...parsedQueryObj })

    //Sort
    if (query.sort) {
        const sortBy = query.sort.split(',').join(' ')
        queryBuilder = queryBuilder.sort(sortBy)
    }

    //select
    if (query.fields) {
        const fields = query.fields.split(',').join(' ')
        queryBuilder = queryBuilder.select(fields)
    }

    //pagination
    let page = query.page ?? 1
    let limit = query.limit ?? 12
    let skip = (page - 1) * limit

    const total = await Event.countDocuments(parsedQueryObj)

    queryBuilder = queryBuilder.skip(skip).limit(limit)

    const events = await queryBuilder

    return { length: events.length, total, events }
}

export const getEvent = async (slug: string) => {
    const event = await Event.findOne({ slug })

    if (!event) throw new CustomError({ message: "Event not found", code: 404 })

    return event
}