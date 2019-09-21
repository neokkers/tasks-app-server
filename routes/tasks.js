const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../Models/Task');

const router = express.Router();

// @route   GET api/tasks
// @desc    Get tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Add new task
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('complexity', 'Complexity must be number from 1 to 7').isInt({
        min: 1,
        max: 7,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, tag, complexity } = req.body;

    try {
      const newTask = new Task({
        name,
        description,
        complexity,
        tag,
        user: req.user.id,
      });

      const task = await newTask.save();

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, tag, complexity } = req.body;

  // build task obj
  const taskFields = {};
  if (name) taskFields.name = name;
  if (description) taskFields.description = description;
  if (tag) taskFields.tag = tag;
  if (complexity) taskFields.complexity = complexity;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) res.status(404).json({ msg: 'Task not found' });

    // make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) res.status(404).json({ msg: 'Task not found' });

    // make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
