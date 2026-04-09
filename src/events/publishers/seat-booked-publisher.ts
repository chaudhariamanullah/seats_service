import amqp from "amqplib";
import type { SeatBooked } from "../types/type.seatBooked.js";

export async function publishedSeatBooked(payload:SeatBooked){

    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();

    const exchange = "seat.events";
    const routingKey = "seat.booked";

    await channel.assertExchange(exchange, "topic", { durable: true });

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
    );

    // await channel.close();
    // await connection.close();
}