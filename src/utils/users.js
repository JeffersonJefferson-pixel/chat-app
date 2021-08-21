const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => user.room === room && user.username === username)

    //validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //store user
    const user = { id, username, room };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return user = users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 22,
//     username: ' Andrew ',
//     room: 'South Philly'
// })

// addUser({
//     id: 23,
//     username: "Mike",
//     room: 'south philly'
// })

// addUser({
//     id: 23,
//     username: "Mike",
//     room: 'chicago'
// })

// console.log(getUser(20))
// console.log(getUsersInRoom("pp"))

// console.log(users);

// const res = addUser({
//     id: 33,
//     username: 'andrew',
//     room: 'south philly',
// })

// console.log(res);

// const removedUser = removeUser(22);
// console.log(removedUser);
// console.log(users);