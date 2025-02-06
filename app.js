import express from "express";
import passport from "./config/passport.js";
import coreMiddleware from "./middleware/coreMiddleware.js";
import securityMiddleware from "./middleware/securityMiddleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import session from "express-session";
import "dotenv/config";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the origin
    }
  },
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

// Configure CORS
app.use(cors(corsOptions));

// Core middleware
coreMiddleware(app);

// Session Middleware (after CORS to handle sessions for authenticated users)
app.use(
  session({
    secret: process.env.SECRET_KEY, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set `true` for HTTPS
  })
);

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
