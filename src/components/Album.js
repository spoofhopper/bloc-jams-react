import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';



class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      albumTitle: album.title,
      albumArtist: album.artist,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0.8,
      isPlaying: false
    };
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.volume;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e=> {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    }
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong:song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  formatTime(timeInSeconds) {
    if (isNaN(timeInSeconds)) { return "-:--" };
    const wholeSeconds = Math.floor(timeInSeconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const seconds = wholeSeconds % 60;
    let time = minutes + ":";
    if (seconds < 10) {
      time += "0";
    }
    time += seconds;
    return time;
  }

  render() {
    return (
      <section>

      <div className="album mdl-grid">
        <div className="mdl-cell mdl-cell--4-col">
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentAlbum={this.state.albumTitle}
            currentArtist={this.state.albumArtist}
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            duration={this.audioElement.duration}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            formatTime={(e) => this.formatTime(e)}
            volume={this.state.volume}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
          />
        </div>

          <div className="mdl-cell mdl-cell--4-col">
            <section id="album-cover">
              <img id="album-cover-art" src={this.state.album.albumCover} alt="album-cover" />
            </section>
          </div>

        </div>

        <div className="album mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <table id="song-list">
               <colgroup>
                 <col id="song-number-column" />
                 <col id="song-title-column" />
                 <col id="song-duration-column" />
               </colgroup>
               <tbody>
                 {
                   this.state.album.songs.map( (song, index) =>
                     <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                       <td className="song-actions">
                         <button>
                           <span className="song-number">{index + 1}</span>
                           <span className="ion-play"></span>
                           <span className="ion-pause"></span>
                         </button>
                       </td>
                       <td className="song-title">{song.title}</td>
                       <td className="song-duration">{this.formatTime(song.duration)}</td>
                     </tr>
                   )
                 }
               </tbody>
             </table>
            </div>

          </div>


      </section>
    );
  }
};

export default Album;
