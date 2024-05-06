import messageModel from "../Models/messageModel.js";

// create a messsage
export const createMessage = async (req, res) => {
  try {
    const { text, senderId, chatId } = req.body;

    const message = messageModel({ chatId, senderId, text });
    const responce = await message.save();
    res.status(200).json(responce);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get messages in a chat room
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = await messageModel.find({ chatId }, null, {
      sort: { createdAt: 1 },
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};
