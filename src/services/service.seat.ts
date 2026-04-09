import seatModel from "../models/model.seats.js";
import type { AddSeatsInput } from "../schemas/schema.addSeats.js";
import type { BulkDeleteSeatsInput } from "../schemas/schema.bulkDelete.js";
import {v4 as uuidv4 } from "uuid";

const seatServices = {
    async getSeats(showtime_public_id:string){

        if(!showtime_public_id){
                return false
        }

        return await seatModel.fetchSeats(showtime_public_id);
    },

    async getAvailableSeats(showtime_public_id:string){
        
        if(!showtime_public_id){
                return false
        }

        return await seatModel.fetchAvailableSeats(showtime_public_id)
    },

    async getSeatCount(showtime_public_id:string){

        if(!showtime_public_id){
                return false
        }

        return await seatModel.fetchSeatCount(showtime_public_id);
    },

    async addSeats(seats:AddSeatsInput){
        
        let seat_public_id:string[] = [];

        for(let i= 0; i < seats.total_seats; i++){
            let id = uuidv4();
            seat_public_id.push(id);
        }

        const showtime_public_id = seats.showtime_public_id;
        
        return await seatModel.insertSeats({
            showtime_public_id,
            seat_public_id
        });
    },

    async removeSeat(seat_public_id:string){

        if(!seat_public_id){
                return false
        }

        return await seatModel.deleteSeat(seat_public_id);
    },

    async bulkRemoveSeats(seats:BulkDeleteSeatsInput){

        const done = await seatModel.bulkDeleteSeats(seats);

        if(done)
            return true

        return false
    },

    async bookSeat(seat_public_id:string[]){
        return await seatModel.bookSeat(seat_public_id);
    },

    async cancelSeat(seat_public_id:string[]){
        return await seatModel.cancelSeat(seat_public_id);
    },
    
    async holdSeat(seat_public_ids:string[]){
        return await seatModel.holdSeat(seat_public_ids)
    },

    async freeSeats(){
        
        return await seatModel.freeSeats();
    }

}

export default seatServices;