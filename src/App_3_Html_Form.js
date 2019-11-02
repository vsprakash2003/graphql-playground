/* import libaries */
import React, {Component} from 'react';
import axios from 'axios';

/* declare global variable */
const appTitle = "Road to React"
const gitHubToken = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN

/* use axios to create a base url */
const axiosGraphQLQuery = axios.create({
  baseUrl: 'https://api.github.com/graphql',
  headers: {
    authorization: `bearer ${gitHubToken}`
  }
})

/* render the application */
export class App extends Component {

  render() {
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
