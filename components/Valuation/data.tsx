import { Metaverse } from "../../lib/enums";

interface Info {
    data:number; 
    time:string;
}


//save the route on a .env
export const test = async(metaverse: Metaverse,route:string) : Promise<Info[]>=> {
    const response = await fetch ("http://localhost:3001/"+route+"?metaverse="+metaverse,{
        method: 'GET'})
    const data = await response.json()
    console.log(await data);
    return data
    
}

