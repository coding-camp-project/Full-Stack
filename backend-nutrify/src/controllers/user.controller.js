import * as userService from "../services/user.service.js";

export const createUser = (req, res) => {
  const user = userService.createUser(req.body);

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const getAllUsers = (req, res) => {
  const users = userService.getAllUsers();

  return res.status(200).json({
    success: true,
    data: users,
  });
};

export const getUserById = (req, res) => {
  const user = userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateUser = (req, res) => {
  const user = userService.updateUser(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const deleteUser = (req, res) => {
  const user = userService.deleteUser(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};
