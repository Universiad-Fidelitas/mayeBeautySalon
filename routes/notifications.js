const { Router } = require('express');
const { check, param } = require('express-validator');
const { getNotifications,
    postNotification,
    putNotification,
    deleteNotification,
    getById } = require('../controllers/notificationsController');
const router = Router();

router.post('/', getNotifications)
router.post('/add', postNotification)

router.get('/:notification_id', [ param('notification_id').isNumeric().withMessage('notification_id must be a number')], getById)
router.put('/:notification_id', [ param('notification_id').isNumeric().withMessage('notification_id must be a number')], router.put('/:notification_id', [ param('notification_id').isNumeric().withMessage('notification_id must be a number')], putNotification)
)
router.post('/delete', [ param('notification_id').isNumeric().withMessage('notification_id must be a number')], deleteNotification)

module.exports = router;