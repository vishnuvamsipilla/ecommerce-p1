require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./config/db.js");
const { seedProducts } = require("./controllers/dumpdata.js");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  // await seedProducts();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
