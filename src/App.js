import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './styles/App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
        </header>

        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>

        <footer class="mdl-mini-footer">
          <ul class="mdl-mini-footer__link-list">
            <li>
              <Link to="/">Landing</Link>
            </li>
            <li>
              <Link to="/Library">Library</Link>
            </li>
          </ul>
        </footer>

      </div>
    );
  }
}

export default App;
