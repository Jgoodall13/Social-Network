export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS') {
        state = Object.assign({}, state, {
            friends: action.friends,
            requests: action.requests
        });
    }
    if (action.type == 'ACCEPT_FRIENDS') {
        const newFriends = state.friends;
        newFriends.push(state.requests.filter((friend) => {
            return friend.id == action.id;
        })[0]);
        const newRequests = state.requests.filter((object) => {
            return object.id != action.id;
        });
        state = Object.assign({}, state, {
            friends: newFriends,
            requests: newRequests
        });
    }
    if (action.type == 'END_FRIENDS') {
        const newFriends = state.friends.filter((object) => {
            return object.id != action.id;
        });
        state = Object.assign({}, state, {
            friends: newFriends
        });
    }
    return state;
}
