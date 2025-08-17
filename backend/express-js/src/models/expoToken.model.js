const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const expoTokenSchema = mongoose.Schema(
  {
    user_device_id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
expoTokenSchema.plugin(toJSON);
expoTokenSchema.plugin(paginate);

/**
 * @typedef ExpoToken
 */
const ExpoToken = mongoose.model('ExpoToken', expoTokenSchema);

module.exports = ExpoToken;
