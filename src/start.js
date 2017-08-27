import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducer';
import  Friends  from '../components/friends';

import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import {Form, Login as LoginComp,Registration as RegistrationComp,Welcome} from "../components/welcome"
import { App, Navbar } from "../components/home";
import { Profile } from "../components/profile";
import { OtherProfile } from "../components/otherprofile";

const store = createStore(reducer, applyMiddleware(reduxPromise));
store.subscribe(() => console.log(store.getState()));

function Login() {
    return <Form component={ LoginComp } />;
}

function Registration() {
    return <Form component={ RegistrationComp } />;
}

const welcomeRouter = (
    <Router history={ hashHistory }>
        <Route path="/" component={ Welcome }>
            <Route path="/login" component={ Login } />
            <Route path="/register" component={ Registration } />
            <IndexRoute component={ Registration } />
  	    </Route>
    </Router>
);

const appRouter = (
    <Provider store={ store }>
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <Route path="/user/:id" component={ OtherProfile } />
            <Route path="/profile" component={ Profile } />
            <Route path="/friends" component={ Friends }/>
            <IndexRoute component={ Profile } />
  	    </Route>
    </Router>
    </Provider>
);

let toRender = welcomeRouter;
if(window.location.pathname != "/welcome"){
        toRender = appRouter
    }

ReactDOM.render(toRender, document.querySelector('main'));
