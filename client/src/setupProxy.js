const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api/"],
    createProxyMiddleware({
      target: "http://127.0.0.1:5000/",
      // target: "https://smcovered.herokuapp.com/",
      // secure: false,
      // pathRewrite: { '^/api': '' }
    })
  );
};

// const { createProxyMiddleware } = require("http-proxy-middleware");
// module.exports = function (app) {
//   app.use(
//     ["/api/"],
//     createProxyMiddleware({
//       // target: "http://localhost:5000",
//       target: "https://smcovered.herokuapp.com/",
//       // pathRewrite: { '^/api': '' }
//     })
//   );
// };