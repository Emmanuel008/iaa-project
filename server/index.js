const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config({ path: "./.env" });

// middleware
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST","GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const userRouter = require("./routers/userRoutes");
const hospitalRouter = require("./routers/hospitalRoutes")
const hospitalInfoRouter = require("./routers/hospitalInfoRoutes");
const patientRouter = require("./routers/patientRoutes")
const admitingRouter = require("./routers/admitingRoutes")
const testResultTreatmentRouter = require("./routers/testResultTreatmentRoutes")
const statsRouter = require("./routers/statsRoutes")

app.use("/user", userRouter);
app.use("/hospital", hospitalRouter);
app.use("/hospitalinfo", hospitalInfoRouter);
app.use("/patient", patientRouter);
app.use("/admiting", admitingRouter);
app.use("/testresulttreatment",testResultTreatmentRouter)
app.use("/stats", statsRouter)


const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});