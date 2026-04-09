import pool from "../config/db.js";
import type { RowDataPacket } from "mysql2/promise";
import type { AddSeats } from "../types/type.addSeats.js";
import type { BulkDeleteSeatsInput } from "../schemas/schema.bulkDelete.js"
import type { ResultSetHeader } from "mysql2/promise";

const seatModel = {

    async fetchSeats(showtime_public_id:string){
        const sql = `SELECT
                    seat_public_id, seat_status
                    FROM seats
                    WHERE showtime_public_id = ?`;

        const [seats] = await pool.execute<RowDataPacket[]>(sql,[showtime_public_id]);
        return seats ?? null;
    },

    async fetchAvailableSeats(showtime_public_id:string){
        const sql = `SELECT
                    seat_public_id
                    FROM seats
                    WHERE showtime_public_id = ?
                    AND seat_status = 'available'`;

        const seats = await pool.execute(sql,[showtime_public_id]);
        return seats ?? null;
    },

    async fetchSeatCount(showtime_public_id:string){
        const sql = `SELECT
                    COUNT(seat_id) as total_seats
                    FROM seats
                    WHERE showtime_public_id = ?`;
            
        const [seatCount] = await pool.execute<[RowDataPacket]>(sql,[showtime_public_id]);
        return seatCount ?? null
    },

    async insertSeats(seats:AddSeats){
        const sql = `INSERT INTO seats (seat_public_id, showtime_public_id)
                     VALUES ?`;

        const values = seats.seat_public_id.map(seatId => [
                       seatId,
                       seats.showtime_public_id ]);
        const [result] = await pool.query<ResultSetHeader>(sql,[values]);
        if(result.affectedRows > 0)
            return true;
        else 
            return false;
    },

    async deleteSeat(seat_public_id:string){
        const sql = "DELETE FROM seats WHERE seat_public_id = ? AND seat_status != 'booked' ";
        const [result] = await pool.execute<ResultSetHeader>(sql,[seat_public_id]);
        if ( result.affectedRows === 1)
            return true
        else
            return false
    },

    async bulkDeleteSeats(seats:BulkDeleteSeatsInput){
        const sql = `DELETE FROM seats 
                     WHERE seat_id IN (
                        SELECT seat_id FROM (
                            SELECT seat_id 
                            FROM seats 
                            WHERE seat_status = 'available'
                            AND showtime_public_id = ?
                            ORDER BY seat_id DESC 
                            LIMIT ?
                        ) AS temp
                     )`;
            
        const [result] = await pool.execute<ResultSetHeader>(sql,[seats.showtime_public_id,seats.total_seats]);
        if ( result.affectedRows > 0)
            return true
        else
            return false
    },

    async bookSeat(seat_public_ids:string[]){

        const placeholders = seat_public_ids.map(() => "?").join(",");

        const sql = `UPDATE seats 
                     SET seat_status = 'booked', hold_expires_at = NULL
                     WHERE 
                     seat_public_id IN (${placeholders})
                     AND seat_status = 'hold' 
                     AND hold_expires_at > NOW()`;

        const [result] = await pool.execute<ResultSetHeader>(sql,[...seat_public_ids]);

        if ( result.affectedRows === seat_public_ids.length)
            return true
        else
            return false
    },

    async cancelSeat(seat_public_ids:string[]){

        const placeholders = seat_public_ids.map(() => "?").join(",");

        const sql = `UPDATE seats 
                     SET seat_status = 'available', hold_expires_at = NULL
                     WHERE 
                     seat_public_id IN (${placeholders})`;
        const [result] = await pool.execute<ResultSetHeader>(sql,[...seat_public_ids]);

        if ( result.affectedRows === seat_public_ids.length)
            return true;
        else
            return false;
    },

    async holdSeat(seatIds:string[]){

        const placeholders = seatIds.map(() => "?").join(",");

        const sql = `UPDATE seats 
                     SET seat_status = 'hold', hold_expires_at = NOW() + INTERVAL 5 MINUTE
                     WHERE seat_public_id IN (${placeholders})
                     AND seat_status = 'available' AND is_active = 1`;
        const [result] = await pool.execute<ResultSetHeader>(sql,[...seatIds]);

        if (result.affectedRows === seatIds.length)
            return true
        else
            return false
    },

    async freeSeats(){
        const sql = `UPDATE seats
                    SET seat_status = 'available',
                    hold_expires_at = NULL
                    WHERE hold_expires_at <= NOW()
                    AND seat_status = 'hold' `;
        
        await pool.execute(sql);    
        return;
    }
}

export default seatModel;
