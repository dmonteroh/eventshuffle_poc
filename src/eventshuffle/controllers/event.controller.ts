import { Request, Response } from "express";
import { HydratedDocument, ObjectId } from "mongoose";
import { EventModel, IEvent, IEventL, IEventVotes} from '../models';

    // Public functions
export const CreateEvent = async (req: Request, res: Response) => {
    try {
        const {dates, name} = req.body;
        let votes: IEventVotes[] = [];
        if (Array.isArray(dates)) {
            votes = createVoteList(dates);
        }
        let event = await newEvent(dates, name, votes)
        // let formattedEvent = this.formatEvent(event);
        // console.log(formattedEvent)
        return res.status(201).send({"id": event.id});
    } catch (error) {
        return res.status(500).send({"message": "Event could not be created: "+error});
    };
    //res.status(501).send({"status": "Not Implemented"})
};

export const GetEvent = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        let event = await GetEventByID(parseInt(id));
        let formattedEvent = formatEvent(event);
        //console.log(formattedEvent)
        return res.status(201).send(formattedEvent);
    } catch (error) {
        return res.status(500).send({"message": "Event not found: "+error});
    }
}

export const GetEventList = async (req: Request, res: Response) => {
    try {
        let events = await getEventList();
        let formattedEvents = formatEventL(events);
        //console.log(formattedEvents)
        return res.status(201).send(formattedEvents);
    } catch (error) {
        return res.status(500).send({"message": "No events not found: "+error});
    }
}

// Public MongoDB functions
export const GetEventByID = async (id: number): Promise<IEvent> => {
    let doc = new Promise<IEvent>((resolve, rejects) => {
        EventModel.findOne({id: id}).exec((err, res) => {
            if (err) {
                rejects(err);
            } else {
                resolve(res);
            }
        });
    });
    return doc;
}

export const UpdateEventVoteList = async (id: number, votes: IEventVotes[]): Promise<IEvent> => {
    const filter: any = {id: id};
    let event = await EventModel.findOne(filter);
    event.votes = votes;
    event.save().then((savedDoc: IEvent) => {
        savedDoc === event;
    });
    return event;
}

// Private functions
// Private MongoDB functions
const newEvent = async (dates: [Date], name: String, votes?: IEventVotes[]) => {
    let event: HydratedDocument<IEvent> = votes == undefined ? new EventModel({id: 0, dates: dates, name: name}) : new EventModel({id: 0, dates: dates, name: name, votes: votes})
    await event.save().then((savedDoc: IEvent) => {
        savedDoc === event;
    });
    return event;
}



const getEventByOID = (id: ObjectId) => {
    let doc = new Promise<IEvent>((resolve, rejects) => {
        EventModel.findById(id).exec((err, res) => {
            if (err) {
                rejects(err);
            } else {
                resolve(res);
            }
        });
    });
    return doc;
}

const getEventList = () => {
    let docs = new Promise<IEvent[]>((resolve, rejects) => {
        EventModel.find().exec((err, res) => {
            if(err) {
                rejects(err);
            } else {
                resolve(res);
            }
        });
    });
    return docs;
}

// Object transform functions -- matching expected output
const formatEvent = (doc: IEvent): IEvent => {
    return {
        id: doc.id,
        dates: doc.dates,
        name: doc.name
    };
}

const createVoteList = (dateList: Date[]): IEventVotes[] => {
    const voteList: IEventVotes[] = dateList.map(date => {
        return {date: date, people: []}
    });
    return voteList;
}

const formatEventL = (doc: IEvent[]): IEventL[] => {

    // map function preferred over foreach
    const eventList: IEventL[] = doc.map(event => {
        if(event.id === undefined) {
            return {id: 0, name: event.name}
        } else {
            return {id: event.id, name: event.name}
        };
    });

    // matching foreach function in case it's neccesary
    // let eventList: IEventL[] = [];
    // doc.forEach(element => {
    //     let tmpEventL: IEventL = {
    //         name: element.name,
    //         id: element.id || 0
    //     };
    //     eventList.push(tmpEventL);
    // });
    return eventList;
}