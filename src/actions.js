import Axios from 'axios';

export function recieveFriends() {
    return Axios.get('/all-requests').then(function({ data }) {
        console.log('this is get freinds data = ' + data);
        return {
            type: 'RECEIVE_FRIENDS',
            friends: data.friends,
            requests: data.requests
        };
    });
}

export function acceptFriends(rec_id) {
    return Axios.post("/request", {status:1, recId: rec_id}).then(({data}) => {
        return {
            type: 'ACCEPT_FRIENDS',
            id:rec_id
        };
    });
}

export function endFriends(rec_id) {
    return Axios.post("/request", {status:5, recId: rec_id}).then(({data}) => {
        return {
            type: 'END_FRIENDS',
            id: rec_id
        };
    });
}
