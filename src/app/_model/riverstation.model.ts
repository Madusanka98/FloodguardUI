import { river } from "./river.model";

export interface riverStation {
    id: number,
    river:river,
    stationId:number,
    name: string,
    latitude: string,
    longitude: string,
    isactive : boolean,
    alertLevel: number | undefined,
    minorLevel: number | undefined,
    majorLevel: number | undefined
    
}
