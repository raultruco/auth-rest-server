import jwt from 'jsonwebtoken';
import config from 'config';
import { Member } from 'models';

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const checkDuplicatedUser = (req, res, next) => {
  return Member.findOne({ email: req.body.email }).then(member => {
    if (member) {
      res.status(500).send({ message: 'Member already exists!' });
    } else {
      next();
    }
  })
  .catch(err => {
    next(err);
  });
};
