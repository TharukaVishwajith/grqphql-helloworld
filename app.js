const express = require('express');
const bodyPaser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event')

const app = express();

// const events = [];
app.use(bodyPaser.json());

// app.get('/',(req,res,next)=>{
//     res.send('Hello World');
// });

app.use('/graphql', graphqlHttp({
    schema: buildSchema( `
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        },

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event]!
        },

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        },
        
        schema {
            query: RootQuery
            mutation:RootMutation
        }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                  .then(events => {
                    return events.map(event => {
                      return { ...event._doc, _id: event.id };
                    });
                  })
                  .catch(err => {
                    throw err;
                  });
              },
            createEvent: (arg)=>{
                // const event = {
                //     _id: Math.random().toString(),
                //     title: arg.eventInput.title,
                //     description: arg.eventInput.description,
                //     price: +arg.eventInput.price,
                //     date: arg.eventInput.date
                // }
                const event = new Event({
                    title: arg.eventInput.title,
                    description: arg.eventInput.description,
                    price: +arg.eventInput.price,
                    date: new Date(arg.eventInput.date)
                });
                // events.push(event);
               return event.save().then(result=>{
                    console.log(result);
                    return { ...result._doc, _id: result._doc._id.toString() };
                }).catch(err=> {
                    console.log(err);
                    throw err;
                })
                // return event;
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-nqozd.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(
    res=> {
        console.log('Connected sussessfully!');
    }
).catch(
    err=> {
        console.log(err);
    });

app.listen(3000);
