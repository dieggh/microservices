import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    isReserved(): Promise<boolean>
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

TicketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    return Boolean(existingOrder);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export {
    Ticket
}