const Message = require('../models/Message');
const User = require('../models/User');

const getChatHistory = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history', error: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all unique users the current user has chatted with
        const sentMessages = await Message.distinct('receiver', { sender: currentUserId });
        const receivedMessages = await Message.distinct('sender', { receiver: currentUserId });

        const contactIds = [...new Set([...sentMessages, ...receivedMessages])];

        const contacts = await User.find({ _id: { $in: contactIds } }).select('email role firebaseUID');

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
};

module.exports = {
    getChatHistory,
    getConversations
};
