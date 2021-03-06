import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { init, getUser, getFbSignOut, getAuth } from './helpers/FirebaseHelper.js';
import SpotifySync from './components/SpotifySync/SpotifySync';
import Home from './components/Home/Home';
import SpotifyLogin from './components/SpotifyLogin/SpotifyLogin';
import CreateAlbum from './components/CreateAlbum/CreateAlbum';
import Artist from './components/Artist/Artist';
import FirebaseSignIn from './components/FirebaseSignIn/FirebaseSignIn';
import Loading from './components/Loading/Loading';
import PageNotFound from './components/PageNotFound/PageNotFound';

require('./main.scss');

class App extends React.Component {
  constructor(props){
    super(props);

    init();

    this.state = {
      user: null,
      isAdmin: false,
      loaded: false
    };

    this.setUserToState = this.setUserToState.bind(this);
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
    this.renderSpotifySync = this.renderSpotifySync.bind(this);
    this.renderSpotifyLogin = this.renderSpotifyLogin.bind(this);
    this.renderCreateAlbum = this.renderCreateAlbum.bind(this);
    this.renderArtist = this.renderArtist.bind(this);
  }

  checkIfAdmin(data) {
    let isAdmin = false;

    data.forEach(function(item) {
      isAdmin = item.val().isAdmin;
    });

    return isAdmin;
  }

  setUserToState(user, data) {
    this.setState({
      user,
      loaded: true,
      isAdmin: this.checkIfAdmin(data)
    });
  }


  persistUserAuth() {
    getAuth()
      .onAuthStateChanged((user) => {
        if (user) {
          getUser(user.email)
            .then((data) => this.setUserToState(user, data));
        } else {
          this.setState({
            loaded: true
          });
        }
      });
  }


  logout() {
    getFbSignOut()
      .then(() => {
        this.setState({
          user: null,
          isAdmin: false,
          loaded: true
        });
      });
  }


  componentDidMount() {
    this.persistUserAuth();
  }


  renderHome() {
    return <Home user={this.state.user} logout={this.logout} isAdmin={this.state.isAdmin}/>;
  }


  renderSpotifySync() {
    if (!this.state.isAdmin) {
      return <Redirect to="/404" />;
    }
    return <SpotifySync />;
  }


  renderSpotifyLogin() {
    if (!this.state.isAdmin) {
      return <Redirect to="/404" />;
    }
    return <SpotifyLogin />;
  }


  renderCreateAlbum() {
    if (!this.state.isAdmin) {
      return <Redirect to="/404" />;
    }
    return <CreateAlbum />;
  }


  renderArtist(props) {
    return <Artist {...props} isAdmin={this.state.isAdmin} />;
  }


  render() {

    if (!this.state.loaded) return <Loading fullPage={true} label={'Loading...'}/>;
    if (!this.state.user)   return <FirebaseSignIn />;

    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" render={this.renderHome}/>
          <Route exact path="/spotify/sync" render={this.renderSpotifySync} />
          <Route exact path="/spotify/login" render={this.renderSpotifyLogin} />
          <Route path="/:access_token(access_token=.*)" render={this.renderSpotifyLogin} />
          <Route exact path="/album/create" render={this.renderCreateAlbum} />
          <Route exact path="/artist/:id" render={this.renderArtist}/>
          <Route exact path="/404" component={PageNotFound} />
          <Route component={PageNotFound} />
        </Switch>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
