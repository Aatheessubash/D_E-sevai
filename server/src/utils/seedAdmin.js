import User from "../models/User.js";

export const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@esevai.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  await User.create({
    name: "Portal Administrator",
    email: adminEmail,
    password: adminPassword,
    phone: "9000000000",
    role: "admin",
  });

  console.log(`Default admin created for ${adminEmail}`);
};
