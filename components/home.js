import React from 'react';
import Axios from 'axios';

export function Navbar({loadModal, url, first, last}) {
    return (
        <div className="fp-nav">
            <a href='/'><img className="logo-img" src="/images/ill.png"/></a>
            <a href='/friends'><h3 style={{color:'white'}}>Friends</h3></a>
            <img onClick={loadModal} id="navpic" src={url} alt={first}/>
        </div>
    );
}

export function UploadModal({url, imgVal, uploadImg, closeWindow}) {
    return (
        <div className="modal">
            <div className="x-button" onClick={closeWindow}>&#9747;</div>
            <img id="modal-profilepic" src={url}/>
            <input type="file" id="file-selector" value={imgVal} onChange={uploadImg}/>
            <label htmlFor="file-selector">
                <h2>Upload file</h2>
            </label>
        </div>
    );
}

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadVisible: false,
            image: "",
        };
        this.uploadImg = this.uploadImg.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        Axios.get("/user").then((info) => {
            this.setState({
                first: info.data[0].first,
                last: info.data[0].last,
                id: info.data[0].id,
                imgUrl: "https://s3.amazonaws.com/jacobimageboard/" + info.data[0].url
            })
            if (info.data[0].bio) {
                this.setState({bio: info.data[0].bio, hasBio: true})
            }
        })

    }

    loadModal() {
        this.setState({uploadVisible: true})
    }

    updateBio(editedBio) {
        console.log('edit bio is this = ' + editedBio);
        this.setState({bio: newBio})
    }

    goHome(){
        window.location.replace('/');
    }

    friendsPage() {
        window.location.replace("/friends");
    }

    closeWindow() {
        this.setState({uploadVisible: false})
    }

    uploadImg(event) {
        this.setState({image: event.target.value});
        var file = event.target.files[0];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('id', this.state.id)

        Axios({url: '/upload', method: 'POST', data: formData, processData: false, contentType: false}).then((response) => {
            console.log(response);
            this.setState({uploadVisible: false, imgUrl: response.data.url})
        });

    }

    render(props) {
        console.log("we rendinging props over hereeee");
        console.log(this.props);
        console.log('this is the children'+ this.props.children);
        const children = React.cloneElement(this.props.children, {
            newBio: this.updateBio,
            imgUrl: this.state.imgUrl,
            first: this.state.first,
            last: this.state.last,
            id: this.state.last,
            bio: this.state.bio,
            hasBio: this.state.hasBio
            })
            console.log("ANYTHING");
        return (
            <div>
                <Navbar loadModal={e => this.loadModal(e)} url={this.state.imgUrl} first={this.state.first} last={this.state.last}/> {this.state.uploadVisible && <UploadModal url={this.state.imgUrl} imgVal={this.state.image} uploadImg={e => this.uploadImg(e)} closeWindow={e => this.closeWindow(e)}/>}
                {children}
                <a href='/logout'><h3>Logout</h3></a>
            </div>
        )
    }
}
