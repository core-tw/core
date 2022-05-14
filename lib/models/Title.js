const mongoose = require('mongoose');

const Titles = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },

  titleId: { type: String, required: true },
});

module.exports = mongoose.model('core_titles', Titles);