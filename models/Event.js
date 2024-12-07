import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seats: { type: Number, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  organizerPhone: { type: String, required: true },
  host: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  minParticipants: { type: Number, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  participants: [String],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
