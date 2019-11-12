/* import libaries */
import ApolloClient, {gql} from 'apollo-boost';
import 'cross-fetch/polyfill';

/* define variables */
const gitHubToken = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;
const uri = 'https://api.github.com/graphql';

/* define the query */
const GET_REPOSITORIES_OF_ORGANIZATION = gql`
query($organization: String!) {
  organization(login: $organization) {
    name
    url
    repositories(first: 5) {
        edges {
            node {
                name
                url
            }
        }
    }
  }
}
`;

/* construct the mutation to star/unstar a repository */
const ADD_STAR = gql`
  mutation($repositoryId: ID!) {
    addStar(input: {starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`

/* initialize apollo client */
const client = new ApolloClient({
  uri: uri,
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `bearer ${gitHubToken}`
      },
    });
  },
})

client.query({
  query: GET_REPOSITORIES_OF_ORGANIZATION,
  variables: {
      organization: "the-road-to-learn-react",
  },
}).then(console.log)

client.mutate({
    mutation: ADD_STAR,
    variables: {
        repositoryId: "MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==",
    },
  }).then(console.log)
