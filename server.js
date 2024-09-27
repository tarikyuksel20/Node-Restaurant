//`
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require('dotenv').config()
const port = process.env.PORT || 8080;
const connectDB = require("./config/db");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/test",require("./routes/testRoutes"));
app.use("/api/v1/auth",require("./routes/authRoutes"));
app.use("/api/v1/user",require("./routes/userRoutes"));
app.use("/api/v1/restaurant",require("./routes/restaurantRoutes"))
app.use("/api/v1/courier",require("./routes/courierRoutes"));

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port http://localhost:${port}`));
    }catch(err){
        console.log(err)
    }
}
start();