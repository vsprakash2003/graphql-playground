/* import libaries */
import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

/* define variables */
const GITHUB_BASE_URL = 'https://api.github.com/graphql';
const cache = new InMemoryCache();

/* set the uri and header */
const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_TOKEN
    }`
  }
})

/* setup apollo client */
const client = new ApolloClient({
  link: httpLink,
  cache,
})
