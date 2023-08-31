const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  from: String,
  recipient: String,
  subaccount_name: String,
  email_id: String,
  date: Date,
  event: String,
  subject: String,
  username: String,
  to: String,
  bcc: String,
  smtp_response: String,
  host: String,
  outbound_ip: String,
  byte_size: Number
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
