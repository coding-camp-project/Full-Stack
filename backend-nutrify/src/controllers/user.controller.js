import * as userService from "../services/user.service.js";

export const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await userService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Akses ditolak. Endpoint ini dinonaktifkan demi keamanan data.",
  });
};

export const getUserById = async (req, res) => {
  try {
    // IDOR protection: Verify ownership
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Anda hanya dapat melihat profil Anda sendiri.",
      });
    }

    const user = await userService.getUserById(req.params.id);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // IDOR protection: Verify ownership
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Anda hanya dapat memperbarui profil Anda sendiri.",
      });
    }

    const user = await userService.updateUser(req.params.id, req.body);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // IDOR protection: Verify ownership
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Anda hanya dapat menghapus akun Anda sendiri.",
      });
    }

    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleLoginUser = async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for Google login",
      });
    }

    const user = await userService.googleLoginUser({ name, email, profilePicture });
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
