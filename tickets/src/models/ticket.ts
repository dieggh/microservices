import mongoose from 'mongoose';

// an interface that describe the properties 
//that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: string;
    userId: string;
}
//interface that describes propierties that a Ticket document has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: string;
    userId: string;
}

//an interfaxe that describe the propierties that the Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    }
},{
    toJSON: {
      transform(doc, ret){
          ret.id = ret._id;
          delete ret._id;          
          delete ret.__v;
      }  
    }
});

TicketSchema.statics.build = ( attrs: TicketAttrs ) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);


export { Ticket };