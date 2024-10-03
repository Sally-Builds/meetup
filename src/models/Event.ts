import { ObjectId, Schema, Types, model } from 'mongoose'

export interface IEvent {
    name: string;
    activities: string[]
    description: string;
    date: string;
    location: string;
    expected_attendees: number;
    user: Types.ObjectId
}


const eventSchema = new Schema<IEvent>({
    name: String,
    activities: [String],
    description: String,
    date: String,
    location: String,
    expected_attendees: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
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


export const EventAttendeeModel = model('EventAttendee', eventAttendees)
export default model('Event', eventSchema)