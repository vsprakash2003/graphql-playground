/* import libaries */
import React, {Component} from 'react';
import axios from 'axios';

/* declare global variable */
const appTitle = "Road to React"
const gitHubToken = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
const url = 'https://api.github.com/graphql';

/* use axios to create a base url */
const axiosGraphQLQuery = axios.create({
  baseUrl: url,
  headers: {
    authorization: `bearer ${gitHubToken}`
  }
})

/* use this function to pass variables to graphql query */
const getIssuesOfRepository = (path, cursor) => {
  const[organization, repository] = path.split('/');
  return axiosGraphQLQuery.post(url, {
    query: GET_ISSUE_OF_REPOSITORY,
    variables: {organization, repository, cursor}
  });
};

/* construct the graphql query */
const GET_ISSUE_OF_REPOSITORY = `
  query(
    $organization: String!, 
    $repository: String!,
    $cursor: String
    ) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(first:5, after: $cursor, states:[OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last:3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  `

/* pass this function to update state */
const resolveIssuesQuery = (queryResult, cursor) => state => {
  const {data, errors} = queryResult.data;
  if (!cursor) {
    return {
      organization: data.organization, 
      errors: errors
    };
  }

  const {edges: oldIssues} = state.organization.repository.issues;
  const {edges: newIssues} = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];
  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
};

/* render the application */
export class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  /* load initial data */
  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  /* when the user changes the input */
  onChange = event => {
    this.setState({path: event.target.value});
  }

  /* when the user submits the form */
  onSubmit = event => {
    this.onFetchFromGitHub(this.state.path);
    event.preventDefault();
  }

  /*fetch data from github */
  onFetchFromGitHub = (path, cursor) => {
    getIssuesOfRepository(path, cursor).then(queryResult => 
        this.setState(resolveIssuesQuery(queryResult, cursor))
        );
      }
  
  /* pagination for more data */
  onFetchMoreIssues = () => {
    const {endCursor} = this.state.organization.repository.issues.pageInfo;
    this.onFetchFromGitHub(this.state.path, endCursor);
  }  

  render() {
    const {path, organization, errors} = this.state;
    return (
      <div className="App">
        <h1>{appTitle}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com
            </label>
          <input 
            id="url"
            type="text" 
            value={path} 
            onChange={this.onChange} 
            style={{width:'300px'}}>
            </input>
          <button type="submit">Search</button>
        </form>

        <hr />
        { organization?
            (<Organization 
              organization={organization} 
              errors={errors} 
              onFetchMoreIssues={this.onFetchMoreIssues}
              />)
          : (<p> No information yet ...</p>)
        }
      </div>
    );
  }
}

export default App;

 /*organization component */
const Organization = ({organization, errors, onFetchMoreIssues}) => {
  if(errors) {
    return(
      <p>
        <strong>Something went wrong ...</strong>
        {errors.map(error => error.message.join(' '))}
      </p>
    )
  }

    return(
      <div>
        <p>
         <strong> Issues from organization: </strong>
          <a href={organization.url}>{organization.name}</a>
        </p>
        <Repository 
        repository = {organization.repository}
        onFetchMoreIssues = {onFetchMoreIssues} 
        />
      </div>
    )
  }

  /*repository component */
const Repository = ({repository, onFetchMoreIssues}) => (
  <div>
      <p>
        <strong>In Repository ...</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>

      <ul>
        {repository.issues.edges.map(issue => (
          <li key = {issue.node.key.id}>
              <a href = {issue.node.url}>{issue.node.title}</a>
              <ul>
                {issue.node.reactions.edges.map(reaction => (
                  <li key = {reaction.node.id}>{reaction.node.content}</li>
                ))}
              </ul>
          </li>
        ))}
      </ul>
      <hr />
      { repository.issues.pageInfo.hasNextPage 
                  && 
        (<button onClick={onFetchMoreIssues}>More</button>)
      }
  </div>
)