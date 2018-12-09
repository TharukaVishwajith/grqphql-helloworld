const express = require('express');
const bodyPaser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyPaser.json());

// app.get('/',(req,res,next)=>{
//     res.send('Hello World');
// });

app.use('/graphql', graphqlHttp({
    schema: buildSchema( `
        type RootQuery {
            events: [String!]!
        },

        type RootMutation {
            createEvent(name: String): String
        },
        
        schema {
            query: RootQuery
            mutation:RootMutation
        }
        `),
        rootValue: {
            events: ()=> {
                return ['Sleeping', 'Playing','Dancing'];
            },
            createEvent: (arg)=>{
                return arg.name;
            }
        },
        graphiql: true
    })
)

app.listen(3000);
