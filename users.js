const usersList = [];

const addUser = ({id, name, profile_id, room}) => {
    name = name.trim();
    room = room.trim().toLowerCase();

    const existingUser = usersList.find((user) => user.room === room && user.name === name);
    if (existingUser) {
        return {error: 'Username is taken'}
    }

    const user = {id, name, profile_id, room};
    usersList.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = usersList.findIndex((user) => user.id === id);
    if (index !== -1) {
        return usersList.splice(index, 1)[0];
    }
}

const getUser = (id) => usersList.find((user) => user.id === id);

const getUserByProfileID = (profile_id) => usersList.find((user) => user.profile_id === profile_id);

const getUsersInRoom = (room) => usersList.filter((user) => user.room === room);

module.exports = {addUser, removeUser, getUser, getUserByProfileID, getUsersInRoom, usersList};