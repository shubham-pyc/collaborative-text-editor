/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { authenticateJWT } from './authMiddleware'; // Import the custom middleware
import express from 'express';
import { login, registerUser, hello } from './api';
// import passport, { jwtAuthMiddleware } from './middleware';
import cors from 'cors';
import passportJWT from 'passport-jwt';
import passport from './middleware';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

import { JWT_SECRETE } from './constants';
import { prisma } from './database';

// Replace 'your-database-name.db' wAth your desired SQLite database name


const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy({ usernameField: 'email' },async (email: string, password, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { email: email } });
      if (!user) {

        return done(null, false, { message: 'Incorrect username.' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {

      return done(error);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRETE,
    },
    async (jwtPayload, done) => {
      const user = await prisma.users.findUnique({
        where: { id: jwtPayload.id },
      });
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }

    }
  )
);
export const jwtAuthMiddleware = () => passport.authenticate('jwt', { session: false });

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// API endpoints
app.post('/register', registerUser);

app.post('/login', login);

app.get('/hello', jwtAuthMiddleware(), hello);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
