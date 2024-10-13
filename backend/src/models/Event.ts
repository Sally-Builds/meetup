import { Schema, Types, model } from 'mongoose'
import slugify from "slugify";
import { generateRandom } from '../utils/lib';

export interface IEvent {
    name: string;
    activities: string[]
    description: string;
    date: Date;
    location: string;
    expected_attendees: number;
    cover_image: { url: string, publicId: string };
    user: Types.ObjectId,
    slug: string;
    _id: string;
}


const eventSchema = new Schema<IEvent>({
    name: String,
    activities: [String],
    description: String,
    date: Date,
    location: String,
    expected_attendees: Number,
    cover_image: {
        url: String,
        publicId: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    slug: String
})

const eventAttendees = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    attendee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

eventSchema.pre('save', function (next) {
    if (this.isNew) {
        this.slug = slugify(`${this.name} ${generateRandom()}`.toLowerCase(), '-')
    }
    next()
})


export const EventAttendeeModel = model('EventAttendee', eventAttendees)
export default model('Event', eventSchema)