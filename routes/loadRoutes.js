let middleware = require('./auth/middleware');

exports.loadRoutes= (app) => {
    const testRouter = require("./test");
    app.use("/api/test", testRouter);

    const registerRouter = require("./auth/register");
    app.use("/api/signup", registerRouter);

    const loginRouter = require("./auth/login");
    app.use("/api/login", loginRouter);

    const adminRouter = require("./auth/admin");
    app.use("/api/admin", middleware.checkToken, adminRouter);

    const userRouter = require("./user");
    app.use("/api/user", middleware.checkToken, userRouter);

}