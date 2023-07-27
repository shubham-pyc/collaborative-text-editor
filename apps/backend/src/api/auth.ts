import passport from 'passport';
import { JWT_SECRETE } from '../constants';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../database';
// import { User } from '../models/User';


export function login(req, res, next) {
  passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {

      if (err || !user) {
        return res.status(401).json({ error: 'Authentication failed.', user });
      }

      // Generate JWT token and send it in the response
      const token = jwt.sign({ id: user.id }, JWT_SECRETE);
      return res.json({ message: 'Login successful.', token });
    }
  )(req, res, next);
}

export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
}
