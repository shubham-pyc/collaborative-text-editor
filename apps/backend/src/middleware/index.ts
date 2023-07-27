import passportJWT from 'passport-jwt';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

import { JWT_SECRETE } from '../constants';
import { prisma } from '../database';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy(async (email: string, password, done) => {
    try {
      console.warn("is this working");
      const user = await prisma.users.findUnique({ where: { email: email } });
      console.warn("is this working 1");
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

// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       secretOrKey: JWT_SECRETE,
//     },
//     async (jwtPayload, done) => {
//       const user = await prisma.users.findUnique({
//         where: { id: jwtPayload.id },
//       });
//       if (user) {
//         done(null, user);
//       } else {
//         done(null, false);
//       }

//       // User.findByPk(jwtPayload.id)
//       //   .then((user) => {
//       //     if (user) {
//       //       done(null, user);
//       //     } else {
//       //       done(null, false);
//       //     }
//       //   })
//       //   .catch((error) => done(error, false));
//     }
//   )
// );

// export const jwtAuthMiddleware = passport.authenticate('jwt', {
//   session: false,
// });
export const jwtAuthMiddleware = () => passport.authenticate('jwt', { session: false });

export default passport;
