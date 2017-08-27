import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { recieveFriends, acceptFriends, endFriends } from '../src/actions';

class Friends extends React.Component {
    componentDidMount() {
            this.props.dispatch(recieveFriends());
    }

    acceptFriends(event) {
        this.props.dispatch(acceptFriends(event.target.id));
    }

    endFriends(event) {
        this.props.dispatch(endFriends(event.target.id));
    }

    render() {
        console.log('Inside the friends zone');
        return (
            <div id="requests">
        <h1>Friends</h1>
        <div className="friends-div">
            {this.props.friends && this.props.friends.map( ( user, index ) => {
                return <div className="friends-user-container"key={index}>
                    <Link to={"/user/"+user.id}>
                    <img className='friends-images' src={"https://s3.amazonaws.com/jacobimageboard/"+user.url}/>
                    <h2>{user.first} {user.last}</h2></Link>
                    <div id={user.id} className="action-button"  onClick={(e) => this.endFriends(e)}>End friendship</div>
                </div>
            })}
        </div>
        <h1>Friend Requests</h1>
        <div className="friends-requests-div">
            {this.props.requests && this.props.requests.map( ( user, index ) => {
                return <div className="current-requests"key={index}>
                <Link to={"/user/"+user.id}>
                <img classname='friends-images' src={"https://s3.amazonaws.com/jacobimageboard/"+user.url}/>
                <h2 >{user.first} {user.last}</h2></Link>
                <div id={user.id} className="action-button" onClick={(e) => this.acceptFriends(e)}>Accept friendship</div>
                </div>
                })}
            </div>
        </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("This should be something?");
    return {
        friends: state.friends,
        requests: state.requests
    }
}

var connectThis = connect(mapStateToProps)(Friends);
console.log(connectThis);
export default connectThis;
