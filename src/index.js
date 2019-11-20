/* import libaries */
import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {InMemoryCache} from 'apollo-cache-inmemory';
import App from './App/';

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

/* application error handling */
const errorLink = onError(({graphQLErrors, networkError}) => {
  if(graphQLErrors) {
    //do something with graphql error
  }
  if(networkError) {
    //do something with network error7
  }
})

/* compose http and error into a single apollo link. httpLink has to be last */
const link = ApolloLink.from([errorLink, httpLink]);

/* setup apollo client */
const client = new ApolloClient({
  link,
  cache,
})

/* render the component */
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);