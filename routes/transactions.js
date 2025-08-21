var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var controller = require('../controllers/transactionsController');

router.post('/', auth, controller.createTransaction);

router.get('/', auth, controller.listTransactions);


router.get('/:id', auth, controller.getTransaction);


router.put('/:id', auth, controller.updateTransaction);


router.delete('/:id', auth, controller.deleteTransaction);

module.exports = router;
