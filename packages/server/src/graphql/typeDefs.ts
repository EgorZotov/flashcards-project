const { gql } = require('apollo-server-koa');

// import {gql} = require('apollo-server-koa')
export default gql`
    type User {
        _id: ID
        name: String!
        avatar: String
    }
    type Query {
        user(id: !ID): [User!]!
    }
`;
