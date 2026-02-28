const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    filePath: {
      type: String,
      required: false,
    },
    externalLink: {
      type: String,
      trim: true,
      required: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Ensure either filePath or externalLink is present
resourceSchema.pre('validate', function (next) {
  if (!this.filePath && !this.externalLink) {
    this.invalidate('filePath', 'Either a file upload or an external link is required');
    this.invalidate('externalLink', 'Either a file upload or an external link is required');
  }
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
