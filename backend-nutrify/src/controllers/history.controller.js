import * as historyService from "../services/history.service.js";

export const getHistory = async (req, res) => {
  try {
    const history = await historyService.getUserHistory(req.user._id);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistoryDetail = async (req, res) => {
  try {
    const history = await historyService.getHistoryById(req.params.id, req.user._id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const deleted = await historyService.deleteHistoryById(req.params.id, req.user._id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Riwayat tidak ditemukan atau tidak berwenang menghapus.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Riwayat makan berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
