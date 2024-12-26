import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  system: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  organizerPhone: { type: String, required: true },
  host: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  minParticipants: { type: Number, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  archived: { type: Boolean, default: true },
  actived: { type: Boolean, default: true },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ID пользователя
    }
  ],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
