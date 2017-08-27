import React from 'react';
import Axios from 'axios';

export class Profile extends React.Component {

  constructor(props) {
    super(props);
    console.log("logging props from constructor");
    console.log(props);
    this.state = {
        image:"",
        bioInput: false,
        hasBio: false,
    };
    this.insertBio = this.insertBio.bind(this);
    this.bioInput = this.bioInput.bind(this);
  }

  updateBio(event) {
      console.log("updating bio");
      this.setState({
          bio:event.target.value
      })
  }


  insertBio() {
      console.log("inserting bio");
      Axios.post("/insert-bio",{
          bio: this.state.bio
    }).then((response) => {
        this.setState({
            hasBio: true,
            bioInput: false
        })
        window.location.replace("/");
        console.log(this.state);
    }).catch(function (error) {
      console.log(error);
    });
  }
  bioInput() {
      console.log(this.state);
      this.setState({
          bioInput:true
      })
  }


  render() {
      console.log('I am rendering over here!')
    return (
        <div className="profile">
            <img id="profilepic" src={this.props.imgUrl}/>

            <div id="profile-info">
                <h1>{this.props.first} {this.props.last}</h1>
                {!this.state.bioInput && this.props.bio || !this.state.bioInput && <h3>User has no bio</h3>}
                {!this.props.bio && <p onClick={(e) => this.bioInput(e)} className='bio-button'>Insert bio</p>}
                {this.state.bioInput && <textarea onChange={e => this.updateBio(e)} rows="5" cols="50" placeholder="Tell me about yourself"></textarea>}
                {this.state.bioInput && <div onClick={e => {this.insertBio(e);this.props.newBio(this.state.bio)}} className="bio-button"><p>Submit</p></div>}
                {this.props.bio && !this.state.bioInput && <div onClick={(e) => this.bioInput(e)} className="bio-button"><p>Update Bio</p></div>}
            </div>
        </div>
    );
  }
}
