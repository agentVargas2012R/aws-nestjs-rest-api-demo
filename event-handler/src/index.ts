import {Main} from "./main";
export async function handler(event:any, context: any): Promise<any> {


    console.log("Event:");
    console.log(event);

    console.log("Context:");
    console.log(context);

    await new Main().launch();

}