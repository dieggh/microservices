import mongoose from 'mongoose';
import { app } from "./app";
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined")
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined")
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined")
    }    
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);     
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        });
        process.on('SIGTERM', () => natsWrapper.client.close());
        process.on('SIGINT', () => natsWrapper.client.close());   

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("connected to mongo tickets:D")
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("listening at 3000 !!!!");
    });

}

start();