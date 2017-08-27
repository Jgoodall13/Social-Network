import React from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import Axios from 'axios';

export function Welcome(props) {
    return (
        <div className="fp-container">
            <div className="fp-image-box">
            <img className="fp-logo" src="/images/ill.png" />
            {props.children}
            </div>
        </div>
    );
}


export class Form extends React.Component {

  constructor(props) {
      console.log(props);
    super(props);
    this.state = {
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleChange(event) {
      const name = event.target.name;
      const value = event.target.value;
    this.setState({
        [name]:value
    });

  }

  handlePost(event) {
      Axios.post("/" + event.target.name, {
          first: this.state.first,
          last: this.state.last,
          email: this.state.email,
          password: this.state.password
    })
    .then(function (response) {
      window.location.replace("/");
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  render(props) {
    console.log(this.state);
    const Component = this.props.component;
    return <Component handleChange={e => this.handleChange(e)}
			          handlePost={e => this.handlePost(e)}/>
  }
}

export function Login({ handleChange, handlePost}) {
    return (
        <div className="form">
              <input type="text" name="email" placeholder="Email" required onChange={handleChange}/>
              <input type="password" name="password" placeholder="Password" required onChange={handleChange}/>
              <input onClick={handlePost} type="submit" name="login-user" />
              <Link to="register" style={{color: 'white', fontSize: '24px', textDecoration: 'none'}}>Register</Link>

        </div>
    );
}

export function Registration({ handleChange, handlePost}) {
    return (
        <div className="form">
          <input placeholder="First name" type="text" name="first" required onChange={handleChange}/>
          <input placeholder="Last name" type="text" name="last" required onChange={handleChange}/>
          <input placeholder="Email" type="email" name="email" required onChange={handleChange}/>
          <input placeholder="Password" type="password" name="password" required onChange={handleChange}/>
          <input className='submit' onClick={handlePost} type="submit" name="register-user" />
          <Link to="login" style={{color: 'white', fontSize: '24px', textDecoration: 'none'}}>Login</Link>

        </div>
    );
}
