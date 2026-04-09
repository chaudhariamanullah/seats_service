import cron from "node-cron";
import seatModel  from "../models/model.seats.js";

cron.schedule("*/10 * * * * *", async () => {
    try {
        await seatModel.freeSeats();
    } catch (err:any) {
        console.log(err.message);
    }
});