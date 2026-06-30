require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const indexRoutes = require("./routes/index.routes");
const healthRoutes = require("./routes/health.routes");
const monitorRoutes = require("./routes/monitorRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------- Core Middleware ----------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------- Routes ----------
app.use("/", indexRoutes);
app.use("/health", healthRoutes);
app.use("/monitor", monitorRoutes);

// ---------- 404 + Error Handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;