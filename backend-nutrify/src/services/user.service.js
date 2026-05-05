let users = [];
let nextId = 1;

export const createUser = (userData) => {
  const user = {
    id: nextId++,
    ...userData,
  };

  users.push(user);
  return user;
};

export const getAllUsers = () => {
  return users;
};

export const getUserById = (id) => {
  return users.find((user) => user.id === Number(id));
};

export const updateUser = (id, userData) => {
  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    id: users[userIndex].id,
  };

  return users[userIndex];
};

export const deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return null;
  }

  const [deletedUser] = users.splice(userIndex, 1);
  return deletedUser;
};
