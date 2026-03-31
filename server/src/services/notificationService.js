import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const notifyUser = async ({ userId, title, message, type = "info", metadata = {} }) =>
  Notification.create({
    userId,
    title,
    message,
    type,
    metadata,
  });

export const notifyAdmins = async ({ title, message, type = "admin", metadata = {} }) => {
  const admins = await User.find({ role: "admin" }).select("_id");

  if (!admins.length) {
    return [];
  }

  return Notification.insertMany(
    admins.map((admin) => ({
      userId: admin._id,
      title,
      message,
      type,
      metadata,
    })),
  );
};
