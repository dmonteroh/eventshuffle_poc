import { Request, Response } from "express";
import { HydratedDocument, ObjectId } from "mongoose";
import { EventModel, IEvent, IEventL, IEventVotes} from '../models';

export class EventController {
    constructor() {};
    
    // Public functions
    public async CreateEvent (req: Request, res: Response) {
        try {
            const {dates, name} = req.body;
            let votes: IEventVotes[] = [];
            if (Array.isArray(dates)) {
                votes = this.createVoteList(dates);
            }
            let event = await this.newEvent(dates, name, votes)
            // let formattedEvent = this.formatEvent(event);
            // console.log(formattedEvent)
            return res.status(201).send({"id": event.id});
        } catch (error) {
            return res.status(500).send({"message": "Event could not be created: "+error});
        }
        //res.status(501).send({"status": "Not Implemented"})
    }

    public async GetEvent (req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            let event = await this.GetEventByID(parseInt(id));
            let formattedEvent = this.formatEvent(event);
            //console.log(formattedEvent)
            return res.status(201).send(formattedEvent);
        } catch (error) {
            return res.status(500).send({"message": "Event not found: "+error});
        }
    }

    public async GetEventList (req: Request, res: Response) {
        try {
            let events = await this.getEventList();
            let formattedEvents = this.formatEventL(events);
            //console.log(formattedEvents)
            return res.status(201).send(formattedEvents);
        } catch (error) {
            return res.status(500).send({"message": "No events not found: "+error});
        }
    }

    // Public MongoDB functions
    public async GetEventByID(id: number): Promise<IEvent> {
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

    public async UpdateEventVoteList(id: number, votes: IEventVotes[]): Promise<IEvent> {
        const filter: any = {id: id};
        const update: any = {votes: votes};
        const options: any = {new: false, upsert: false, rawResult: false};
        let event: IEvent = {id: -1, name: "", dates: []};
        await EventModel.findOneAndUpdate(filter, update, options).then((res) => {
            if(res.value instanceof EventModel) {
                event = res.value;
            }
        })
        return event;
    }

    // Private functions
    // Private MongoDB functions
    private async newEvent(dates: [Date], name: String, votes?: IEventVotes[]): Promise<IEvent> {
        let event: HydratedDocument<IEvent> = votes == undefined ? new EventModel({id: 0, dates: dates, name: name}) : new EventModel({id: 0, dates: dates, name: name, votes: votes})
        await event.save().then((savedDoc: IEvent) => {
            savedDoc === event;
        });
        return event;
    }

    

    private async getEventByOID(id: ObjectId): Promise<IEvent> {
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

    private async getEventList(): Promise<IEvent[]> {
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
    private formatEvent(doc: IEvent): IEvent {
        return {
            id: doc.id,
            dates: doc.dates,
            name: doc.name
        };
    }

    private createVoteList(dateList: Date[]): IEventVotes[] {
        const voteList: IEventVotes[] = dateList.map(date => {
            return {date: date, people: []}
        });
        return voteList;
    }

    private formatEventL(doc: IEvent[]): IEventL[] {

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

}