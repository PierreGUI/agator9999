import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Message from '../Message/Message.js';
import SpotifyLogin from '../SpotifyLogin/SpotifyLogin.js';
import SpotifyProfile from '../SpotifyProfile/SpotifyProfile';
import Loading from '../../components/Loading/Loading';
import { Link } from 'react-router-dom';
import { getAccessToken } from '../../helpers/SpotifyHelper.js';
require('./Synchronize.scss');

class Synchronize extends React.Component {

  constructor(props) {
    super();

    this.accessToken = getAccessToken();
    
    this.state = {
      error: false,
      message: null
    };
  }


  render() {
    return (
      <div className='content-container'>

        <div className='back-to-library'>
          <Link to='/'>&#9839; Back to library</Link>
        </div>

        <h2>Synchronize your Spotify saved albums</h2>

        <div className='form-container'>
          {this.accessToken &&
            <div className='sync-container'>
              <SpotifyProfile />
              <Button
                label={'Synchronize'}
                handleClick={this.props.handleClick}
              />
            </div>
          }

          {!this.accessToken &&
            <SpotifyLogin redirect='spotify/sync'/>
          }

          {this.props.loadingMessage &&
            <Loading fullPage={false} label={this.props.loadingMessage} />
          }

          {this.props.message &&
            <Message message={this.props.message} error={this.props.error}/>}
          <p className='note'>Synchronize saves all of your Spotify saved albums, and all of their artists to the database. It does not erase your current library but completes it.</p>

        </div>
      </div>
    );
  }
}

Synchronize.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  loadingMessage: PropTypes.string
};

export default Synchronize;
