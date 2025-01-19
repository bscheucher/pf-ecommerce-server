import express from "express";
import morgan from "morgan";

export default function coreMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
}
