import { Metaverse } from "../../lib/enums";

interface Info {
    data:number; 
    time:string;
}

export const test = async(metaverse: Metaverse,route:string) : Promise<Info[]>=> {
    const response = await fetch ("http://localhost:3001/"+route,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({metaverse:"sandbox"}),
        })
        
    const data = await response.json()
    console.log(await data);
    return data
    
}

