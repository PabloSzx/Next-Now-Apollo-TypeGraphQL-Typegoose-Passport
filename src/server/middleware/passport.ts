import connect_mongo from "connect-mongo";
import { Router } from "express";
import ExpressSession from "express-session";
import { ObjectId } from "mongodb";
import passport from "passport";
import { InstanceType } from "typegoose";

import { WRONG_INFO } from "../consts";
import { connection } from "../db";
import { User, UserModel } from "../entities";

export const auth = Router();

const MongoStore = connect_mongo(ExpressSession);

auth.use(
  ExpressSession({
    secret: "tF47Oz#R$v2oCT&gooX%QclBNFa$E8OosV^vBebkYVro8$5DB1a",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 86400000, secure: false },
    store: new MongoStore({
      mongooseConnection: connection,
    }),
  })
);

auth.use(passport.initialize());
auth.use(passport.session());

passport.serializeUser<InstanceType<User>, ObjectId>((user, cb) => {
  if (user) cb(null, user._id);
  else cb(WRONG_INFO);
});

passport.deserializeUser<InstanceType<User>, ObjectId>(async (_id, done) => {
  try {
    const user = await UserModel.findById(_id);

    if (user) {
      done(null, user);
    } else {
      done(WRONG_INFO);
    }
  } catch (err) {
    console.error(err);
  }
});

export const requireAuth = Router();
requireAuth.use(auth, (req, res, next) => {
  if (req.user && req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
});
