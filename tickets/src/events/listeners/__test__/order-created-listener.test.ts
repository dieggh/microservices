import { OrderCreatedEvent, OrderStatus } from "@diegodmicroserv/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'L arc en ciel',
        price: 200,
        userId: 'abc'
    });
    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '123abc',
        expiresAt: '',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { data, listener, msg, ticket }
};

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});