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
const getIssuesOfRepository = path => {
  const[organization, repository] = path.split('/');
  return axiosGraphQLQuery.post(url, {
    query: getIssuesOfRepositoryQuery(organization, repository)
  });
}

/* construct the graphql query */
const getIssuesOfRepositoryQuery = (organization, repository) =>`
  {
    organization(login: "${organization}") {
      name
      url
      repository(name: "${repository}") {
        name
        url
        issues(last:5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`

/* pass this function to update state */
const resolveIssuesQuery = queryResult => () => (
  {
    organization: queryResult.organization, 
    errors: queryResult.errors,
  }
)

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
  onFetchFromGitHub = path => {
    getIssuesOfRepository(path).then(queryResult => 
        this.setState(resolveIssuesQuery(queryResult))
        )
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
            (<Organization organization={organization} errors={errors} />)
          : (<p> No information yet ...</p>)
        }
      </div>
    );
  }
}

export default App;

 /*organization component */
const Organization = ({organization, errors}) => {
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
        <Repository repository = {organization.repository} />
      </div>
    )
  }

  /*repository component */
const Repository = ({repository}) => (
  <div>
      <p>
        <strong>In Repository ...</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>

      <ul>
        {repository.issues.edges.map(issue => (
          <li key = {issue.node.key.id}>
              <a href = {issue.node.url}>{issue.node.title}</a>
          </li>
        ))}
      </ul>
  </div>
)