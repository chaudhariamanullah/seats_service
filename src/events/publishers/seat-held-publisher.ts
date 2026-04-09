import amqp from "amqplib";
import type { SeatHeld } from "../types/type.seatHeld.js";

export async function publishedSeatHeld(payload:SeatHeld){
    
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();

    const exchange = "seat.events";
    const routingKey = "seat.held";

    await channel.assertExchange(exchange,"topic", {durable: true} );

    channel.publish(
        exchange,
        routingKey,
        Buffer.from( JSON.stringify(payload) ),
        {persistent:true}
    )
}