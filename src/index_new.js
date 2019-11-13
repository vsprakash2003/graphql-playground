import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import registerServiceWorker from './registerServiceWorker';
import App from './App';

import './style.css';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';
const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_TOKEN
    }`
  }
})

const client = new ApolloClient({
  link: httpLink,
  cache,
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
