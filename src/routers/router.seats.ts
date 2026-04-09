import { Router } from "express";
import seatsController from "../controllers/controller.seats.js";
const router = Router();

router.get("/available",seatsController.getAvailableSeats);
router.post("/hold",seatsController.holdSeat);
router.post("/book",seatsController.bookSeat);
router.post("/cancel",seatsController.cancelSeat);
router.get("/free",seatsController.freeSeats)
router.delete("/bulk-remove",seatsController.bulkRemoveSeats);
router.post("/",seatsController.addSeats);
router.get("/counts/:showtime_public_id",seatsController.getSeatCount);

router.get("/:showtime_public_id", seatsController.getSeats);
router.delete("/:seat_public_id",seatsController.removeSeat);

export default router;
