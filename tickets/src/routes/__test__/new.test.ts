import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it('has a route handler listening to api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets').send({});
    await expect(response).not.toEqual(404);
});

it('can only access if the user is signin', async () => {
    return await request(app)
        .post('/api/tickets')
        .send({}).expect(401);
});

it('return a status other to 401 if the user is signin', async () => {
    const response = await request(app)
        .post('/api/tickets').send({})
        .set('Cookie', global.signin());

    expect(response.status).not.toEqual(401);
});

it('returns error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        }).expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        }).expect(400);

});
it('returns error if a invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'aaaqwqe',
            price: -10
        }).expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'aaaasdasd',
        }).expect(400);
});
it('creates a ticket with valid inputs', async () => {
  
    let tickets = await Ticket.find({});    
    expect(tickets.length).toEqual(0);

    const title = 'adasdad';

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 20
        })
        .expect(201);
    
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
});