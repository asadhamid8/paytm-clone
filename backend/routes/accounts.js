const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtsecret = require('../config');
const middleware = require('./middleware');
const { accountmodel, userdbmodel } = require('../db');

router.use(express.json());


router.get("/balance", middleware, async (req, res) => {
  try {
    const account = await accountmodel.findOne({ userid: req.user.userid });
const user = await userdbmodel.findById(req.user.userid);

    if (!account || !user) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ balance: account.balance, username: user.firstname }); // or user.firstName depending on your schema
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/transfer", middleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;
    const amountInt = parseInt(amount);

    const fromAccount = await accountmodel.findOne({ userid: req.user.userid }).session(session);

    if (!fromAccount || fromAccount.balance < amountInt) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toUserId = new mongoose.Types.ObjectId(to);
    const toAccount = await accountmodel.findOne({ userid: toUserId }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid recipient account" });
    }

    fromAccount.balance -= amountInt;
    toAccount.balance += amountInt;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    await session.commitTransaction();
    res.json({ message: "Transfer successful" });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    session.endSession();
  }
});

module.exports = router;