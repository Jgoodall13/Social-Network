import React from 'react';
import Axios from 'axios';
import {browserHistory, Push} from 'react-router';

export class OtherProfile extends React.Component {

    constructor(props) {
        console.log(props.id);
        super(props);

        this.state = {
            image: "",
            hasBio: false,
            requestStatus: 0
        };

        this.sendRequest = this.sendRequest.bind(this);

    }

    componentDidMount() {


        Axios.post("/friend-requests", {
            recId: window.location.pathname.split("/").slice(-1)[0]
        }).then((response) => {
            if(response.data.recipient != this.props.params.id){
                if(response.data.response == 1) {
                    this.setState({requestStatus : "unfriend"})
                } else if (response.data.response == 2) {
                    this.setState({requestStatus : "accept"})
                } else {
                    this.setState({requestStatus : "request friendship"})
                }
            } else {
                console.log("you made this request");
                    if (response.data.response == 1) {
                        this.setState({requestStatus : "unfriend"})
                    } else if (response.data.response == 2){
                        this.setState({requestStatus : "cancel"})
                    } else {
                        this.setState({requestStatus : "request friendship"})
                    }
                }
            });


        Axios.get("/user/" + this.props.params.id + '/info').then((info) => {

            if (info.data.redirect) {
                browserHistory.push('/profile')
            } else {

                this.setState({
                    first: info.data[0].first, last: info.data[0].last, id: info.data[0].id,
                      imgUrl:"https://s3.amazonaws.com/jacobimageboard/"+info.data[0].url
                })
                if (info.data[0].bio) {
                    this.setState({bio: info.data[0].bio, hasBio: true})
                } else {
                    this.setState({bio: "user has no bio", hasBio: true})
                }
            }
        })

    }

    sendRequest() {
        if(this.state.requestStatus == "request friendship"){
        Axios.post("/request", {
            recId: window.location.pathname.split("/").slice(-1)[0],
            status: 2
        }).then((response) => {
            this.setState({requestStatus : "cancel"});
        })
    } else if (this.state.requestStatus == "cancel") {
        Axios.post("/request", {
            recId: window.location.pathname.split("/").slice(-1)[0],
            status: 4
        }).then((response) => {
            this.setState({requestStatus : "request friendship"});
        })
    } else if (this.state.requestStatus == "accept") {
        Axios.post("/request", {
            recId: window.location.pathname.split("/").slice(-1)[0],
            status: 1
        }).then((response) => {
            this.setState({requestStatus : "unfriend"});
        })
    } else if (this.state.requestStatus == "unfriend") {
        Axios.post("/request", {
            recId: window.location.pathname.split("/").slice(-1)[0],
            status: 5
        }).then((response) => {
            this.setState({requestStatus : "request friendship"});
        })
    }
    }

    render(props) {
        console.log("i'm rendering over heres");
        return (
            <div className="profile">
                <img id="profilepic" src={this.state.imgUrl}/>
                <div id="profile-info">
                    <h1>{this.state.first} {this.state.last}</h1>
                    {this.state.hasBio && <p>{this.state.bio}</p>}
                    <div id="request-btn" onClick={this.sendRequest}>
                        {this.state.requestStatus}
                    </div>
                </div>

            </div>
        )
    }
}
