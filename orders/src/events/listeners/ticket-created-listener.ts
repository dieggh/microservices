import { Subjects, TicketCreatedEvent } from '@diegodmicroserv/common';
import Listener from '@diegodmicroserv/common/build/events/base-listener';
import { Message, SubscriptionOptions } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './quote-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    quoteGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      const { id, title, price } = data;
      const ticket = Ticket.build({
        id, title, price
      });
      await ticket.save();
      msg.ack();
    }
}