const express = require('express');
const bodyPaser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];
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
            events: ()=> {
                return events;
            },
            createEvent: (arg)=>{
                const event = {
                    _id: Math.random().toString(),
                    title: arg.eventInput.title,
                    description: arg.eventInput.description,
                    price: +arg.eventInput.price,
                    date: arg.eventInput.date
                }
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })
)

app.listen(3000);
