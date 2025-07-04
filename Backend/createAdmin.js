// createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // adjust path

mongoose.connect('mongodb://localhost:27017/KDFashion', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hashedPassword = await bcrypt.hash('DhrumiL@0333', 10);
  const admin = new Admin({ email: 'admin@kd.com', password: hashedPassword });
  await admin.save();
  console.log("✅ Admin created");
  mongoose.disconnect();
});
