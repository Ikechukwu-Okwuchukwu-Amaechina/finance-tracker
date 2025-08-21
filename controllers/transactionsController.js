var Transaction = require('../models/Transaction');
var User = require('../models/User');

async function createTransaction(req, res) {
  if (!req.body || req.body.amount === undefined) {
    return res.status(400).json({ message: 'Amount is required' });
  }
  var amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }
  var type = req.body.type;
  if (type !== 'credit' && type !== 'debit') {
    return res.status(400).json({ message: "Type must be 'credit' or 'debit'" });
  }
  var description = req.body.description ? String(req.body.description) : '';
  
  try {
    var transaction = new Transaction({ user: req.user._id, amount: amount, type: type, description: description });
    await transaction.save();
    var user = await User.findById(req.user._id);

    if (type === 'credit') {
      user.balance = user.balance + amount;
    } else {
      user.balance = user.balance - amount;
    }
    await user.save();
    return res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function listTransactions(req, res) {
  var page = 1;
  var limit = 10;
  if (req.query && req.query.page) {
    page = parseInt(req.query.page, 10) || 1;
  }
  if (req.query && req.query.limit) {
    limit = parseInt(req.query.limit, 10) || 10;
  }

  var filter = { user: req.user._id };
  if (req.query && req.query.type) {
    if (req.query.type === 'credit' || req.query.type === 'debit') {
      filter.type = req.query.type;
    }
  }

  try {
    var total = await Transaction.countDocuments(filter);
    var transactions = await Transaction.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    return res.json({ page: page, limit: limit, total: total, transactions: transactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getTransaction(req, res) {
  try {
    var tx = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    return res.json(tx);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateTransaction(req, res) {
  try {
    var tx = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: 'Not found' });

    var oldAmount = tx.amount;
    var oldType = tx.type;

    if (req.body && req.body.amount !== undefined) {
      var newAmount = Number(req.body.amount);
      if (!isNaN(newAmount) && newAmount > 0) {
        tx.amount = newAmount;
      }
    }
    if (req.body && req.body.type) {
      if (req.body.type === 'credit' || req.body.type === 'debit') {
        tx.type = req.body.type;
      }
    }
    if (req.body && req.body.description !== undefined) {
      tx.description = String(req.body.description);
    }
    await tx.save();

  var user = await User.findById(req.user._id);

    if (oldType === 'credit') {
      user.balance = user.balance - oldAmount;
    } else {
      user.balance = user.balance + oldAmount;
    }
    if (tx.type === 'credit') {
      user.balance = user.balance + tx.amount;
    } else {
      user.balance = user.balance - tx.amount;
    }
    await user.save();
    return res.json(tx);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteTransaction(req, res) {
  try {
    var tx = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    var user = await User.findById(req.user._id);
    if (tx.type === 'credit') {
      user.balance = user.balance - tx.amount;
    } else {
      user.balance = user.balance + tx.amount;
    }
    await user.save();
    // prefer deleteOne on the document for modern mongoose
    await tx.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};
