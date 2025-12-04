import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const SALT_ROUNDS = 10;

async function promoteAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "curriculum_generator",
  });

  try {
    const email = "davidsodrelins@outlook.com";
    const password = "Admin@123456";
    const name = "David Sodré";

    // Check if user exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      // User exists, just promote to admin
      await connection.execute("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
      console.log(`✅ Usuário ${email} promovido a admin`);
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      await connection.execute(
        `INSERT INTO users (email, password_hash, name, loginMethod, role, is_donor, total_donated, resumes_this_month, email_verified, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, 'email', 'admin', 0, 0, 0, 1, NOW(), NOW(), NOW())`,
        [email, passwordHash, name]
      );

      console.log(`✅ Usuário admin criado: ${email}`);
      console.log(`   Senha: ${password}`);
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await connection.end();
  }
}

promoteAdmin();
