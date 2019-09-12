const express = require('express');

const router = express.Router();

// @route   GET api/notes
// @desc    Get notes
// @access  Private
router.get('/', (req, res) => {
  res.send('Get notes');
});

// @route   POST api/notes
// @desc    Add new note
// @access  Private
router.post('/', (req, res) => {
  res.send('Add new note');
});

// @route   PUT api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update note');
});

// @route   DELETE api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete note');
});

module.exports = router;
