import seatServices from "../services/service.seat.js";
import { AddSeatsSchema } from "../schemas/schema.addSeats.js";
import { BulkDeleteSeatsSchema } from "../schemas/schema.bulkDelete.js";
import type { Request, Response } from "express";

const seatController = {
    async getSeats(req:Request,res:Response){
        try{

            const showtime_public_id = req.params.showtime_public_id as string;
            const seats =  await seatServices.getSeats(showtime_public_id);

            if(seats === false)
                return res.status(400).json({message:"Screen Id Is Missing"});

            return res.status(200).json(seats);
        } catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async getAvailableSeats(req:Request,res:Response){
        try{
            const showtime_public_id = req.params.showtime_public_id as string;

            const available_seats =  await seatServices.getAvailableSeats(showtime_public_id);

            if(available_seats === false)
                return res.status(400).json({message:"Screen Id Is Missing"});

            return res.status(200).json(available_seats);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async getSeatCount(req:Request,res:Response){
        try{
            const showtime_public_id = req.params.showtime_public_id as string;

            const total_seats =  await seatServices.getSeatCount(showtime_public_id);

            if(total_seats === false)
                return res.status(400).json({message:"Screen Id Is Missing"});

            return res.status(200).json(total_seats);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async addSeats(req:Request,res:Response){
        try{
            const seats = AddSeatsSchema.parse(req.body);
            await seatServices.addSeats(seats);
            return res.status(201).json({message:"Seats Added"});
        } catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
       
    },

    async removeSeat(req:Request,res:Response){
       try{

            const seat_public_id = req.params.seat_public_id as string;
            const removedSeat = await seatServices.removeSeat(seat_public_id);

             if(removedSeat === false)
                return res.status(400).json({message:"Screen Id Is Missing"});

            return res.status(200).json({message:"Seat Deleted"});
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async bulkRemoveSeats(req:Request,res:Response){

        try{
            const seats = BulkDeleteSeatsSchema.parse(req.body);

            const completed = await seatServices.bulkRemoveSeats(seats);

            if(!completed)
                return res.status(400).json({message:"Seats Can't Be Deleted"});

            return res.status(200).json({message:"Seats Deleted"}) 
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async bookSeat(req:Request,res:Response){
        try{

            const seat_public_ids = req.body.seats;

            if( !Array.isArray(seat_public_ids) ) 
                return res.status(400).json({message:"Expected Array"});

            const booked = await seatServices.bookSeat(seat_public_ids);

            if(booked)
                return res.status(200).json({message:"Seat Booked"});
            else
                return res.status(409).json({message:"Seat Booking Failed"});
            
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async cancelSeat(req:Request,res:Response){
        try{

            const seat_public_ids = req.body.seats;

            if( !Array.isArray(seat_public_ids) ) 
                return res.status(400).json({message:"Expected Array"});

            const cancel = await seatServices.cancelSeat(seat_public_ids);

            if(cancel)
                return res.status(200).json({message:"Seat Cancelled"});
            else
                return res.status(409).json({message:"Seat Cancellation Failed"});
        } catch(err){
                return res.status(500).json({error:err});
        }
    },
    
    async holdSeat(req:Request,res:Response){
        try{

            const seat_public_ids = req.body.seats;

            if( !Array.isArray(seat_public_ids)) 
                return res.status(400).json({message:"Expected Array"});

            const hold = await seatServices.holdSeat(seat_public_ids);
            
            if(hold)
                return res.status(200).json({message:"Seat On Hold"});
            else
                return res.status(409).json({message:"Seat Holding Failed"});
        } catch(err:any){
                console.log(err.message)
                return res.status(500).json({error:err});
        }
    },

    async freeSeats(req:Request,res:Response){
        try{
            await seatServices.freeSeats();
            return res.status(200).json({message:"Seats freed"});  
        } catch(err){
            return res.status(500).json({error:err});
        }
    }
}

export default seatController;