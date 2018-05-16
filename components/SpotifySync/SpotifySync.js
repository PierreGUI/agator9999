import React from 'react';
import PropTypes from 'prop-types';
import Synchronize from '../Synchronize/Synchronize';
import { Link } from 'react-router-dom';
import { getAccessToken, getAndSetUserSavedAlbums } from '../../Helpers/SpotifyHelper.js';
import * as fb from '../../Helpers/FirebaseHelper.js';

class SpotifySync extends React.Component {

  constructor(props) {
    super();

    // Pagination limit
    this.limit = 50;

    // Get accessToken
    this.accessToken = getAccessToken();

    // set local state
    this.state = {
      error: false,
      message: null
    };

    this.handleClick = this.handleClick.bind(this);
  }

  //TODO: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
  /**
   * Update the Message component props
   * @param  {Boolean} error   Has error
   * @param  {String} message  Message to display
   */
  updateMessage(error, message) {
    this.setState({
      error: error,
      message: message
    });
  }

  /**
   * Start fetching first batch of albums
   */
  handleClick() {
    this.updateMessage(false, 'Loading albums and artists...');

    getAndSetUserSavedAlbums(this.accessToken, 0)
      .then(() => this.handleAlbumSyncSuccess())
      .catch((error) => this.handleError(error.message));
  }


  /**
   * On success of fetching a batch of albums, fetch the next one
   * Else, start getting artist images
   * @param  {int} totalAlbums  Total number of albums to fetch
   * @param  {int} offset      Current pagination offset
   */
  handleAlbumSyncSuccess() {
    this.updateMessage(false, 'Loading albums and artists successful!');
  }


  /**
   * Display error message when a problem occured
   * @param  {String} message Error message
   */
  handleError(message) {
    this.updateMessage(true, message);
  }


  render() {
    return (
      <Synchronize
        message = { this.state.message }
        error = { this.state.error }
        handleClick={ this.handleClick }
      />
    );
  }
}


export default SpotifySync;
