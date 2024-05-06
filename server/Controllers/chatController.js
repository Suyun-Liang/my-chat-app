import chatModel from "../Models/chatModel.js";

// createChat
export const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) res.status(200).json(chat);

    const newChat = new chatModel({ members: [firstId, secondId] });
    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// findUserChats
export const findUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await chatModel.find({ members: { $in: [userId] } });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// findChat
export const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;

    const chats = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
