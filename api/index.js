require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const connectDB = require("../server/config/connectDB.js");

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

// Templating engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views")); // Set the views directory
app.set("layout", "./layouts/main"); // Set the default layout

app.use("/", require("../server/routes/registerRoute.js"));
app.use("/", require("../server/routes/transferRoute.js"));
app.use("/", require("../server/routes/verifyRoute.js"));
app.use("/", require("../server/routes/updateRoute.js"));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
