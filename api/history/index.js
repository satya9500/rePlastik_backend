const express = require('express');
const {findAndStore, getNews, getHistory} = require('./controller');
// eslint-disable-next-line new-cap
const router = express.Router();
const {protect} = require('../../middleware/auth');
router.route('/perform').post(protect, findAndStore);
router.route('/news').post(protect, getNews);
router.route('/history').get(protect, getHistory);

module.exports = router;
