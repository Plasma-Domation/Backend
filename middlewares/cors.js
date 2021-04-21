const cors = require('cors');

const whitelist = new Set([
  process.env.CLIENT_URL,
  'https://localhost:3000',
]);
// const corsOptions = {
//   optionsSuccessStatus: 200,
//   origin: function (origin, callback) {
//     if (whitelist.has(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };
const corsOptions = {
  optionsSuccessStatus: 200,
  origin: process.env.CLIENT_URL
};

module.exports = cors(corsOptions);
