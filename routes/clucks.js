const express = require('express');
const knex = require('../db/client');

const router = express.Router();

// Get all clucks
router.get('/', (req, res) => {
  knex('clucks')
    .orderBy('created_at')
    .then((data) => {
      const current_time = Date.now();
      let time_passed;
      data.forEach((item) => {
        const ms = current_time - item.created_at;
        if (ms > 31536000000) {
          const years = Math.floor(ms / 31536000000);
          time_passed = `${
            years === 1 ? `${years} year` : `${years} years`
          } ago`;
        } else if (ms > 2628000000) {
          const months = Math.floor(ms / 2628000000);
          time_passed = `${
            months === 1 ? `${months} month` : `${months} months`
          } ago`;
        } else if (ms > 86400000) {
          const days = Math.floor(ms / 86400000);
          time_passed = `${days === 1 ? `${days} day` : `${days} days`} ago`;
        } else if (ms > 3600000) {
          const hours = Math.floor(ms / 3600000);
          time_passed = `${
            hours === 1 ? `${hours} hour` : `${hours} hours`
          } ago`;
        } else if (ms > 60000) {
          const minutes = Math.floor(ms / 60000);
          time_passed = `${
            minutes === 1 ? `${minutes} minute` : `${minutes} minutes`
          } ago`;
        } else {
          time_passed = 'Just now';
        }
        item['time_passed'] = time_passed;
      });
      res.render('clucks/clucks_index', { clucks: data });
    });
});

// Make a new cluck
router.get('/new', (req, res) => {
  res.render('clucks/new');
});

router.post('/', (req, res) => {
  console.log(req.body);
  knex('clucks')
    .insert({
      username: res.locals.username,
      image_url: req.body.image_url,
      content: req.body.content,
    })
    .then(() => {
      res.redirect('/clucks');
    });
});

module.exports = router;
