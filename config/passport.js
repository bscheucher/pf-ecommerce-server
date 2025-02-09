import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "./database.js";
import bcrypt from "bcrypt";

passport.use(
  // Passport.js expects username as identifier by default, when using email usernameField is required
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM os_users WHERE email = $1",
          [email]
        );

        const user = result.rows[0];

        if (!user) {
          console.error("Email not found:", email);
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          console.error("Password mismatch for email:", email);
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in local strategy:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM os_users WHERE id = $1", [
      id,
    ]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
