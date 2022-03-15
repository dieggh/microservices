import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@diegodmicroserv/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put('/api/tickets/:id', requireAuth,
[
    body('title')
        .not()
        .isEmpty()
        .withMessage("Title is required"),
    body('price')
        .isFloat({gt: 0})
        .withMessage("Price must be greater than 0"),
],
validateRequest,
    async (req: Request, res: Response) => {
        
        const ticket = await Ticket.findById(req.params.id);
        
        if(ticket){
            if(ticket.userId !== req.currentUser!.id){
                throw new NotAuthorizedError();
            }
            ticket.set({
                title: req.body.title,
                price: req.body.price
            });
            await ticket.save();
            new TicketUpdatedPublisher(natsWrapper.client).publish({
                id: ticket.id,
                title: ticket.title,
                userId: ticket.userId,
                price: ticket.price
            });
            return res.send(ticket);
        }else{
            throw new NotFoundError();
        }                
    });

export { router as updateTicketRouter };