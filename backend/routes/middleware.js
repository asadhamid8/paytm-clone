const express = require('express');
const jwt = require('jsonwebtoken');
const jwtsecret = require('../config');

async function middlewareW(req, res, next) {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(403).json({ message: 'Missing Authorization header' });
  }

  const token = header.split(' ');

  if (token.length !== 2 || token[0] !== 'Bearer') {
    return res.status(403).json({ message: 'Malformed token format' });
  }

  try {
    const verified = jwt.verify(token[1], jwtsecret);
    
    // ✅ Normalize to req.user.userid
    req.user = { userid: verified.userid || verified._id };

    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Invalid JWT' });
  }
}

module.exports = middlewareW;