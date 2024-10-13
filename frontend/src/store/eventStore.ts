import { create } from "zustand";
import { IEvent } from "../api/event";

type EventStore = {
    events: IEvent[] | null
    setEvents: (data: IEvent[]) => void
    getEvent: (slug: string) => IEvent | null
};


export const useEventStore = create<EventStore>((set, get) => ({
    events: null,
    setEvents: (data) => {
        set(() => ({ events: data }));
    },
    getEvent: (slug) => {
        const { events } = get()

        if (events && events.length > 0) return events.find(event => event.slug === slug) || null;

        return null
    }
}));