const app = require("./app");

const PORT = 5000 || 9999;


app.listen(PORT, () => {
  console.log(`app is running on port:${PORT}`);
});