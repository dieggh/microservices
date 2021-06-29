import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';

it('return 404 if the provided  id does not exits', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'aassd',
            price: 20
        })
        .expect(404);               
});

it('return 401 if the user is not autenticated', async () => {
 
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)        
        .send({
            title: 'aassd',
            price: 20
        })
        .expect(401);        
});

it('return 401 if the user dont own the ticket', async () => {
 
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdad',
            price: 122
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'wuaaa',
            price: 12
        })
        .expect(401);
            
});

it('return 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
        title: 'asdad',
        price: 122
    })
    .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: '',
            price: 12
        })
        .expect(400);    
        
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'golawa',
            price: -1
        })
        .expect(400);    
});

it('updates the ticket, the request is correct', async () => {
    
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
        title: 'asdad',
        price: 122
    })
    .expect(201);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'golawa',
            price: 200
        })
        .expect(200); 
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send({});
    expect(ticketResponse.body.title).toEqual("golawa");
    expect(ticketResponse.body.price).toEqual(200);

});
