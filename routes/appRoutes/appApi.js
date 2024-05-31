const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();
const leadController = require('@/controllers/appControllers/leadController');
const paymentController = require('@/controllers/appControllers/paymentController');
const { hasPermission } = require('@/middlewares/permission');
const updatePaymentcontroller = require('@/controllers/middlewaresControllers/createCRUDController/updatePayment');
const uploadDocumentController = require('@/controllers/middlewaresControllers/createCRUDController/uploadDocument');
const { firebaseStorageUpload, saveImageUrls } = require('@/firebase/firebaseStorageUpload');
const { createComment } = require('@/controllers/comments/comments');
const { getCommentsByStudent } = require('@/controllers/comments/getcomment');
const history = require('@/controllers/historyControllers/history');

// //_________________________________ API for employees_____________________

// //_____________________________________ API for leads __________________________________________________

router.route('/lead/create').post(hasPermission('create'), firebaseStorageUpload(), saveImageUrls, catchErrors(leadController.create));
router.route('/lead/comment/:applicationId').post(catchErrors(createComment));
router.route('/lead/read/:id').get(hasPermission('read'), catchErrors(leadController.read));
router.route('/lead/update/:id').patch(hasPermission('update'), catchErrors(leadController.update));
router.route('/lead/updatePayment/:id').put(hasPermission('update'), firebaseStorageUpload(), saveImageUrls, catchErrors(updatePaymentcontroller.updatePayment));
router.route('/lead/uploadDocument/:id').put(hasPermission('update'), firebaseStorageUpload(), saveImageUrls, catchErrors(uploadDocumentController.uploadDocument));
router.route('/lead/delete/:id').delete(hasPermission('delete'), catchErrors(leadController.delete));
router.route('/lead/search').get(catchErrors(leadController.search));
router.route('/lead/list').get(catchErrors(leadController.list));
router.route('/lead/teamfilter').get(catchErrors(leadController.teamfilter));
router.route('/lead/getComment/:applicationId').get(catchErrors(getCommentsByStudent));
router.route('/lead/filter').get(catchErrors(leadController.filter));
router.route('/lead/summary').get(catchErrors(leadController.summary));
router.route('/student/list').get(catchErrors(history));
router.route('/lead/getAllNotifications').get(catchErrors(leadController.getAllNotifications));
router
  .route('/lead/deleteNotificationByMessage/:message')
  .delete(catchErrors(leadController.deleteNotificationByMessage)); //

// //_____________________________________________ API for client payments_________________

router.route('/payment/create').post(hasPermission('create'), catchErrors(paymentController.create));
router.route('/payment/read/:id').get(hasPermission('read'), catchErrors(paymentController.read));
router.route('/payment/update/:id').patch(hasPermission('update'), catchErrors(paymentController.update));
router.route('/payment/delete/:id').delete(hasPermission('delete'), catchErrors(paymentController.delete));
router.route('/payment/search').get(catchErrors(paymentController.search));
router.route('/payment/list').get(catchErrors(paymentController.list));
router.route('/payment/filter').get(catchErrors(paymentController.filter));
router.route('/payment/pdf/:id').get(hasPermission('read'), catchErrors(paymentController.generatePDF));
router.route('/payment/summary').get(catchErrors(paymentController.summary));
router.route('/payment/mail').post(catchErrors(paymentController.mail));


module.exports = router;
