import { NotFoundError, Subjects, TicketUpdatedEvent } from '@diegodmicroserv/common';
import Listener from '@diegodmicroserv/common/build/events/base-listener';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './quote-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    quoteGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }
        ticket.set({ title,price });
        await ticket.save();
        msg.ack();
    }
}