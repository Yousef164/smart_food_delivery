import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { clientId, clientSecret, callbackURL } from "./env.js";
import { User } from "../models/index.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      session: false,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            password: null,
            verifyEmail: true,
          });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

export default passport;