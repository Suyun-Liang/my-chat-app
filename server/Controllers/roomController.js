import roomModal from "../Models/roomModel.js";

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    const newRoom = new roomModal({ name });

    const responce = await newRoom.save();

    res.status(200).json(responce);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const joinRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { userId } = req.body;

    const updatedRoom = await roomModal.findByIdAndUpdate(
      roomId,
      {
        $addToSet: { members: userId },
      },
      { new: true }
    );

    if (!updatedRoom) res.status(400).json("room does not exist...");

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { userId } = req.body;

    const updatedRoom = await roomModal.findByIdAndUpdate(
      roomId,
      {
        $pull: { members: userId },
      },
      { new: true }
    );

    if (!updatedRoom) return res.status(400).json("room does not exist...");

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findAllRooms = async (req, res) => {
  try {
    const responce = await roomModal.find();
    res.status(200).json(responce);
  } catch (error) {
    res.status(500).json(error);
  }
};
