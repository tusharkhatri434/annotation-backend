const express = require('express');
const { body, validationResult } = require('express-validator');
const Annotation = require('../models/Annotation');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/annotations
// @desc    Create a new annotation
// @access  Private
router.post(
  '/',
  [
    body('x').isNumeric().withMessage('X coordinate must be a number'),
    body('y').isNumeric().withMessage('Y coordinate must be a number'),
    body('width').isFloat({ min: 1 }).withMessage('Width must be at least 1'),
    body('height').isFloat({ min: 1 }).withMessage('Height must be at least 1'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { x, y, width, height, fill, stroke, strokeWidth, name } = req.body;

      const annotation = new Annotation({
        userId: req.userId,
        name: name || '',
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
      });

      await annotation.save();

      res.status(201).json({
        success: true,
        message: 'Annotation created successfully',
        annotation,
      });
    } catch (error) {
      console.error('Create annotation error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while creating annotation' 
      });
    }
  }
);

// @route   GET /api/annotations
// @desc    Get all annotations for the current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const annotations = await Annotation.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: annotations.length,
      annotations,
    });
  } catch (error) {
    console.error('Get annotations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching annotations' 
    });
  }
});

// @route   GET /api/annotations/:id
// @desc    Get a specific annotation by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const annotation = await Annotation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!annotation) {
      return res.status(404).json({ 
        success: false,
        message: 'Annotation not found' 
      });
    }

    res.json({
      success: true,
      annotation,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid annotation ID' 
      });
    }
    console.error('Get annotation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching annotation' 
    });
  }
});

// @route   PUT /api/annotations/:id
// @desc    Update an existing annotation
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { x, y, width, height, fill, stroke, strokeWidth, name } = req.body;

    // Find annotation
    let annotation = await Annotation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!annotation) {
      return res.status(404).json({ 
        success: false,
        message: 'Annotation not found' 
      });
    }

    // Update fields
    if (name !== undefined) annotation.name = name;
    if (x !== undefined) annotation.x = x;
    if (y !== undefined) annotation.y = y;
    if (width !== undefined) annotation.width = width;
    if (height !== undefined) annotation.height = height;
    if (fill !== undefined) annotation.fill = fill;
    if (stroke !== undefined) annotation.stroke = stroke;
    if (strokeWidth !== undefined) annotation.strokeWidth = strokeWidth;

    await annotation.save();

    res.json({
      success: true,
      message: 'Annotation updated successfully',
      annotation,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid annotation ID' 
      });
    }
    console.error('Update annotation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating annotation' 
    });
  }
});

// @route   DELETE /api/annotations/:id
// @desc    Delete an annotation by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const annotation = await Annotation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!annotation) {
      return res.status(404).json({ 
        success: false,
        message: 'Annotation not found' 
      });
    }

    res.json({
      success: true,
      message: 'Annotation deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid annotation ID' 
      });
    }
    console.error('Delete annotation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting annotation' 
    });
  }
});

module.exports = router;
