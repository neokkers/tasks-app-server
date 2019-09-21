const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  complexity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('task', TaskSchema);
