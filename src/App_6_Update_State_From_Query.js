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

/* construct the graphql query */
const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`

/* render the application */
export class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  /* load initial data */
  componentDidMount() {
    this.onFetchFromGitHub();
  }

  /* when the user changes the input */
  onChange = event => {
    this.setState({path: event.target.value});
  }

  /* when the user submits the form */
  onSubmit = event => {
    // fetch data
    event.preventDefault();
  }

  /*fetch data from github */
  onFetchFromGitHub = () => {
    axiosGraphQLQuery
    .post(url, {query: GET_ORGANIZATION})
    .then(result => 
        this.setState(() => ({
          data: result.data.data.organization,
          errors: result.data.errors
          })
        )
      )
    }

  render() {
    const {path} = this.state;
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
        {/* Here comes the result! */}
      </div>
    );
  }
}

export default App;
