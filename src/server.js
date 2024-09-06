//const { PORT = 8000} = process.env;

/*const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);*/
require("dotenv").config();
const app = require("./app");

// connectDB
const connectDB = require("../db/connect.js");

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MANGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log("Error starting the server:", error);
  }
};

start();
