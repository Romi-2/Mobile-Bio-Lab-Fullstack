const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ this makes routes available under /api/admin
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
