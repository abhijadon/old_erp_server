const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const setFilePathToBody = require('@/middlewares/uploadMiddleware/setFilePathToBody');
const employeeController = require('@/controllers/appControllers/employeeController');
const paymentModeController = require('@/controllers/appControllers/paymentModeController');
const taxController = require('@/controllers/appControllers/taxController');
const clientController = require('@/controllers/appControllers/clientController');
const leadController = require('@/controllers/appControllers/leadController');
const invoiceController = require('@/controllers/appControllers/invoiceController');
const itemController = require('@/controllers/appControllers/itemController');
const quoteController = require('@/controllers/appControllers/quoteController');
const supplierController = require('@/controllers/appControllers/supplierController');
const supplierOrderController = require('@/controllers/appControllers/supplierOrderController');
const expenseController = require('@/controllers/appControllers/expenseController');
const expenseCategoryController = require('@/controllers/appControllers/expenseCategoryController');
const paymentController = require('@/controllers/appControllers/paymentController');
const orderController = require('@/controllers/appControllers/orderController');
const offerController = require('@/controllers/appControllers/offerController');
const kycController = require('@/controllers/appControllers/kycController');
const inventoryController = require('@/controllers/appControllers/inventoryController');
const { hasPermission } = require('@/middlewares/permission');
const updatePaymentcontroller = require('@/controllers/middlewaresControllers/createCRUDController/updatePayment');
const uploadDocumentController = require('@/controllers/middlewaresControllers/createCRUDController/uploadDocument');
const { firebaseStorageUpload, saveImageUrls } = require('@/firebase/firebaseStorageUpload');
const { createComment } = require('@/controllers/comments/comments');
const { getCommentsByStudent } = require('@/controllers/comments/getcomment');
const history = require('@/controllers/historyControllers/history');
// //_________________________________ API for employees_____________________
router.route('/employee/create').post(hasPermission('create'),catchErrors(employeeController.create));
router.route('/employee/read/:id').get(hasPermission('read'),catchErrors(employeeController.read));
router.route('/employee/update/:id').patch(hasPermission('update'),catchErrors(employeeController.update));
router.route('/employee/delete/:id').delete(hasPermission('delete'),catchErrors(employeeController.delete));
router.route('/employee/search').get(catchErrors(employeeController.search));
router.route('/employee/list').get(catchErrors(employeeController.list));
router.route('/employee/filter').get(catchErrors(employeeController.filter));

// //_____________________________________ API for payment mode_____________________
router.route('/paymentMode/create').post(hasPermission('create'),catchErrors(paymentModeController.create));
router.route('/paymentMode/read/:id').get(hasPermission('read'),catchErrors(paymentModeController.read));
router.route('/paymentMode/update/:id').patch(hasPermission('update'),catchErrors(paymentModeController.update));
router.route('/paymentMode/delete/:id').delete(hasPermission('delete'),catchErrors(paymentModeController.delete));
router.route('/paymentMode/search').get(catchErrors(paymentModeController.search));
router.route('/paymentMode/list').get(catchErrors(paymentModeController.list));
router.route('/paymentMode/filter').get(catchErrors(paymentModeController.filter));

// //_____________________________________ API for taxes _______________________________
router.route('/taxes/create').post(hasPermission('create'),catchErrors(taxController.create));
router.route('/taxes/read/:id').get(hasPermission('read'),catchErrors(taxController.read));
router.route('/taxes/update/:id').patch(hasPermission('update'),catchErrors(taxController.update));
router.route('/taxes/search').get(catchErrors(taxController.search));
router.route('/taxes/list').get(catchErrors(taxController.list));
router.route('/taxes/filter').get(catchErrors(taxController.filter));

// //_____________________________________ API for clients __________________________________________________
router.route('/client/create').post(hasPermission('create'),catchErrors(clientController.create));
router.route('/client/read/:id').get(hasPermission('read'),catchErrors(clientController.read));
router.route('/client/update/:id').patch(hasPermission('update'),catchErrors(clientController.update));
router.route('/client/delete/:id').delete(hasPermission('delete'),catchErrors(clientController.delete));
router.route('/client/search').get(catchErrors(clientController.search));
router.route('/client/list').get(catchErrors(clientController.list));
router.route('/client/filter').get(catchErrors(clientController.filter));
router.route('/client/summary').get(catchErrors(clientController.summary));

// //_____________________________________ API for leads __________________________________________________
 
router.route('/lead/create').post(hasPermission('create'),firebaseStorageUpload(),saveImageUrls, catchErrors(leadController.create));
router.route('/lead/comment/:applicationId').post(catchErrors(createComment));
router.route('/lead/read/:id').get(hasPermission('read'),catchErrors(leadController.read));
router.route('/lead/update/:id').patch(hasPermission('update'),catchErrors(leadController.update));
router.route('/lead/updatePayment/:id').put(hasPermission('update'),firebaseStorageUpload(),saveImageUrls,catchErrors(updatePaymentcontroller.updatePayment));
router.route('/lead/uploadDocument/:id').put(hasPermission('update'),firebaseStorageUpload(),saveImageUrls,catchErrors(uploadDocumentController.uploadDocument));
router.route('/lead/delete/:id').delete(hasPermission('delete'),catchErrors(leadController.delete));
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
  .delete(catchErrors(leadController.deleteNotificationByMessage)); // //_________________________________________________________________API for invoices_____________________
router.route('/invoice/create').post(hasPermission('create'),catchErrors(invoiceController.create));
router.route('/invoice/read/:id').get(hasPermission('read'),catchErrors(invoiceController.read));
router.route('/invoice/update/:id').patch(hasPermission('update'),catchErrors(invoiceController.update));
router.route('/invoice/delete/:id').delete(hasPermission('delete'),catchErrors(invoiceController.delete));
router.route('/invoice/search').get(catchErrors(invoiceController.search));
router.route('/invoice/list').get(catchErrors(invoiceController.list));
router.route('/invoice/filter').get(catchErrors(invoiceController.filter));
router.route('/invoice/pdf/:id').get(hasPermission('read'),catchErrors(invoiceController.generatePDF));
router.route('/invoice/summary').get(catchErrors(invoiceController.summary));
router.route('/invoice/mail').post(catchErrors(invoiceController.sendMail));

// //_________________________________________________________________API for items_____________________
router.route('/item/create').post(hasPermission('create'),catchErrors(itemController.create));
router.route('/item/read/:id').get(hasPermission('read'),catchErrors(itemController.read));
router.route('/item/update/:id').patch(hasPermission('update'),catchErrors(itemController.update));
router.route('/item/delete/:id').delete(hasPermission('delete'),catchErrors(itemController.delete));
router.route('/item/search').get(catchErrors(itemController.search));
router.route('/item/list').get(catchErrors(itemController.list));
router.route('/item/filter').get(catchErrors(itemController.filter));

// //_________________________________________________________________API for Quotes_____________________

router.route('/quote/create').post(hasPermission('create'),catchErrors(quoteController.create));
router.route('/quote/read/:id').get(hasPermission('read'),catchErrors(quoteController.read));
router.route('/quote/update/:id').patch(hasPermission('update'),catchErrors(quoteController.update));
router.route('/quote/delete/:id').delete(hasPermission('delete'),catchErrors(quoteController.delete));
router.route('/quote/search').get(catchErrors(quoteController.search));
router.route('/quote/list').get(catchErrors(quoteController.list));
router.route('/quote/filter').get(catchErrors(quoteController.filter));
router.route('/quote/pdf/:id').get(hasPermission('read'),catchErrors(quoteController.generatePDF));
router.route('/quote/summary').get(catchErrors(quoteController.summary));
router.route('/quote/convert/:id').get(hasPermission('read'),catchErrors(quoteController.convertQuoteToInvoice));
router.route('/quote/mail').post(catchErrors(quoteController.sendMail));

// //___________________________________________ API for suppliers _____________________
router.route('/supplier/create').post(hasPermission('create'),catchErrors(supplierController.create));
router.route('/supplier/read/:id').get(hasPermission('read'),catchErrors(supplierController.read));
router.route('/supplier/update/:id').patch(hasPermission('update'),catchErrors(supplierController.update));
router.route('/supplier/delete/:id').delete(hasPermission('delete'),catchErrors(supplierController.delete));
router.route('/supplier/search').get(catchErrors(supplierController.search));
router.route('/supplier/list').get(catchErrors(supplierController.list));
router.route('/supplier/filter').get(catchErrors(supplierController.filter));

// //___________________________________________ API for suppliers _____________________
router.route('/supplierOrder/create').post(hasPermission('create'),catchErrors(supplierOrderController.create));
router.route('/supplierOrder/read/:id').get(hasPermission('read'),catchErrors(supplierOrderController.read));
router.route('/supplierOrder/update/:id').patch(hasPermission('update'),catchErrors(supplierOrderController.update));
router.route('/supplierOrder/delete/:id').delete(hasPermission('delete'),catchErrors(supplierOrderController.delete));
router.route('/supplierOrder/search').get(catchErrors(supplierOrderController.search));
router.route('/supplierOrder/list').get(catchErrors(supplierOrderController.list));
router.route('/supplierOrder/filter').get(catchErrors(supplierOrderController.filter));

// //_________________________________________________________________API for expenses_____________________

router.route('/expense/create').post(hasPermission('create'),catchErrors(expenseController.create));
router.route('/expense/read/:id').get(hasPermission('read'),catchErrors(expenseController.read));
router.route('/expense/update/:id').patch(hasPermission('update'),catchErrors(expenseController.update));
router.route('/expense/delete/:id').delete(hasPermission('delete'),catchErrors(expenseController.delete));
router.route('/expense/search').get(catchErrors(expenseController.search));
router.route('/expense/list').get(catchErrors(expenseController.list));
router.route('/expense/filter').get(catchErrors(expenseController.filter));

// //_________________________________________________________________API for expense categories________________

router.route('/expenseCategory/create').post(hasPermission('create'),catchErrors(expenseCategoryController.create));
router.route('/expenseCategory/read/:id').get(hasPermission('read'),catchErrors(expenseCategoryController.read));
router.route('/expenseCategory/update/:id').patch(hasPermission('update'),catchErrors(expenseCategoryController.update));
router.route('/expenseCategory/delete/:id').delete(hasPermission('delete'),catchErrors(expenseCategoryController.delete));
router.route('/expenseCategory/search').get(catchErrors(expenseCategoryController.search));
router.route('/expenseCategory/list').get(catchErrors(expenseCategoryController.list));
router.route('/expenseCategory/filter').get(catchErrors(expenseCategoryController.filter));

// //_____________________________________________ API for client payments_________________

router.route('/payment/create').post(hasPermission('create'),catchErrors(paymentController.create));
router.route('/payment/read/:id').get(hasPermission('read'),catchErrors(paymentController.read));
router.route('/payment/update/:id').patch(hasPermission('update'),catchErrors(paymentController.update));
router.route('/payment/delete/:id').delete(hasPermission('delete'),catchErrors(paymentController.delete));
router.route('/payment/search').get(catchErrors(paymentController.search));
router.route('/payment/list').get(catchErrors(paymentController.list));
router.route('/payment/filter').get(catchErrors(paymentController.filter));
router.route('/payment/pdf/:id').get(hasPermission('read'),catchErrors(paymentController.generatePDF));
router.route('/payment/summary').get(catchErrors(paymentController.summary));
router.route('/payment/mail').post(catchErrors(paymentController.mail));

//router.route('/payment/mail).post( atchErrors(paymentController.sendMail));

// //_________________________________________________________________API for Offers_____________________

router.route('/offer/create').post(hasPermission('create'),catchErrors(offerController.create));
router.route('/offer/read/:id').get(hasPermission('read'),catchErrors(offerController.read));
router.route('/offer/update/:id').patch(hasPermission('update'),catchErrors(offerController.update));
router.route('/offer/delete/:id').delete(hasPermission('delete'),catchErrors(offerController.delete));
router.route('/offer/search').get(catchErrors(offerController.search));
router.route('/offer/list').get(catchErrors(offerController.list));
router.route('/offer/filter').get(catchErrors(offerController.filter));
router.route('/offer/pdf/:id').get(hasPermission('read'),catchErrors(offerController.generatePDF));
router.route('/offer/summary').get(catchErrors(offerController.summary));

// //_________________________________________________________________API for Order________________

router.route('/order/create').post(hasPermission('create'),catchErrors(orderController.create));
router.route('/order/read/:id').get(hasPermission('read'),catchErrors(orderController.read));
router.route('/order/update/:id').patch(hasPermission('update'),catchErrors(orderController.update));
router.route('/order/delete/:id').delete(hasPermission('delete'),catchErrors(orderController.delete));
router.route('/order/search').get(catchErrors(orderController.search));
router.route('/order/list').get(catchErrors(orderController.list));
router.route('/order/filter').get(catchErrors(orderController.filter));

// //_________________________________________________________________API for Inventory

router.route('/inventory/create').post(hasPermission('create'),catchErrors(inventoryController.create));
router.route('/inventory/read/:id').get(hasPermission('read'),catchErrors(inventoryController.read));
router.route('/inventory/update/:id').patch(hasPermission('update'),catchErrors(inventoryController.update));
router.route('/inventory/delete/:id').delete(hasPermission('delete'),catchErrors(inventoryController.delete));
router.route('/inventory/search').get(catchErrors(inventoryController.search));
router.route('/inventory/list').get(catchErrors(inventoryController.list));
router.route('/inventory/filter').get(catchErrors(inventoryController.filter));

// //_________________________________________________________________API for Kyc________________

const kycFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/kyc');
  },
  filename: function (req, file, cb) {
    console.log('🚀 ~ file: appApi.js:182 ~ file:', file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const kycFileUpload = multer({ storage: kycFileStorage });

router
  .route('/kyc/create')
  .post(
    kycFileUpload.single('file'),
    setFilePathToBody('filePath'),
    catchErrors(kycController.create)
  );
router
  .route('/kyc/update/:id')
  .patch(
    kycFileUpload.single('file'),
    setFilePathToBody('filePath'),
    catchErrors(kycController.update)
  );

router.route('/kyc/read/:id').get(hasPermission('read'),catchErrors(kycController.read));

router.route('/kyc/delete/:id').delete(hasPermission('delete'),catchErrors(kycController.delete));
router.route('/kyc/search').get(catchErrors(kycController.search));
router.route('/kyc/list').get(catchErrors(kycController.list));
router.route('/kyc/filter').get(catchErrors(kycController.filter));

module.exports = router;
