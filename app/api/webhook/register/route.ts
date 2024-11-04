import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if(!WEBHOOK_SECRET){
        throw new Error("Please add webhook secret in .env file");
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if(!svix_id || !svix_timestamp || !svix_signature){
        return new Response("Error occured - No svix headers")
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
        event = await wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent;
    } catch (error: any) {
        console.error("Error verifying webhookd", error)
        return new Response("Error occured - Webhook verification failed", { status: 400 });
    }

    console.log(event);
    const {id} = event.data;
    const eventType = event.type;
    
    //logs
    if(eventType === "user.created"){
        try {
            const {email_addresses, primary_email_address_id} = event.data;
            console.log(email_addresses, primary_email_address_id);

            // optional
            const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id);

            if(!primaryEmail){
                return new Response("No Primary Email", {status: 400});
            }

            //create a user in DB
            const newUser = await prisma.user.create({
                data: {
                    id: event.data.id,
                    email: primaryEmail.email_address,
                    isSubscribed: false,
                }
            });

            console.log("New user created", newUser); //developer console
            //can retunt the respons as new user....
        } catch (error: any) {
            return new Response("Error creating user in database", {status: 400})
        }
    }

    return new Response("Webhook recieved successfully", {status: 200});
}
