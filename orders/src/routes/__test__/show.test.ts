import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('it fetches the order', async () => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 84,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();
    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
    
    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 84,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();
    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
    });