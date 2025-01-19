import { createUser, findUserById, editUser } from "../services/userService.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }

  try {
    const newUser = await createUser(username, email, password, isAdmin);
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.is_admin,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    if (error.message.includes("duplicate key value")) {
      return res
        .status(409)
        .json({ error: "Username or email already exists." });
    }
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid user ID.");
  }
  try {
    const user = await findUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("An error occurred while fetching the user.");
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Generate a JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },

        process.env.JWT_SECRET, // Secret key from environment variable
        { expiresIn: "1h" } // Token expiration time
      );
      console.log("User", user);
      res.status(201).json({
        message: "User logged in successfully!",
        token, // Send token to the client
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

// Update a user's information
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send("Invalid user ID.");
  }

  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res
      .status(422)
      .send(
        "At least one field (username, email, or password) must be provided."
      );
  }

  try {
    const oldUserData = await findUserById(id);
    console.log("Old user data:", oldUserData);
    if (!oldUserData) {
      return res.status(404).send("User not found.");
    }

    const updates = {
      username: username || oldUserData.username,
      email: email || oldUserData.email,
      password: password
        ? await bcrypt.hash(password, 10)
        : oldUserData.password,
    };

    const updatedUser = await editUser(id, updates);

    res.status(200).json({
      message: "User updated successfully!",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.code === "23505") {
      res.status(409).send("Username or email already exists.");
    } else {
      res.status(500).send("An error occurred while updating the user.");
    }
  }
};
