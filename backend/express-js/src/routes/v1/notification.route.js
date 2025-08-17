const express = require('express');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notification.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/create-token').post(auth(), validate(notificationValidation.createToken), notificationController.createToken);

router.post(
  '/send-notifications',
  validate(notificationValidation.sendNotifications),
  notificationController.sendPushNotification
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /notifications/send-notifications:
 *   post:
 *     summary: Send notifications
 *     description: Send push notifications to all registered devices.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: This is a test notification
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Notifications sent
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
