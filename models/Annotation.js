const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    default: '',
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  x: {
    type: Number,
    required: [true, 'X coordinate is required'],
  },
  y: {
    type: Number,
    required: [true, 'Y coordinate is required'],
  },
  width: {
    type: Number,
    required: [true, 'Width is required'],
    min: [1, 'Width must be at least 1'],
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [1, 'Height must be at least 1'],
  },
  fill: {
    type: String,
    default: 'rgba(0, 123, 255, 0.3)',
  },
  stroke: {
    type: String,
    default: '#007bff',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
annotationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Annotation', annotationSchema);
