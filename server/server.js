const express = require("express");
const app = express();
require("./db/mongoose");
app.use(express.json());
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const doctorRouter = require("./routes/doctorsRoute");



app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/doctor',doctorRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Node server started at ${port}`);
})