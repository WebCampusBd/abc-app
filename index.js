require("dotenv").config();
const app = require("./app");
const port = process.env.PORT;
const dbConnect = require("./config/database");

app.listen(port, async (req, res) => {
  console.log(`Server is runnig at http://localhost:${port}`);
  await dbConnect();
});
