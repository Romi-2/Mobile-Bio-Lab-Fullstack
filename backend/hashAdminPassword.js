// hashAdminPassword.js
import bcrypt from "bcrypt";

const plainPassword = "Admin@123"; // your current admin password

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("✅ Hashed password to insert in DB:");
  console.log(hash);
  process.exit(0); // exit after printing
});
