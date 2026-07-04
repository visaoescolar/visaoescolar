const mysql = require('mysql2/promise');

const passwords = ['', 'root', '123456', '1234', 'admin', 'ceep', '12345678'];

async function test() {
  for (const password of passwords) {
    try {
      console.log(`Testing password: "${password}"...`);
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: password
      });
      console.log(`\n🎉 SUCCESS! The correct password is: "${password}"`);
      await connection.end();
      process.exit(0);
    } catch (e) {
      console.log(`  Failed: ${e.code} (${e.message})`);
    }
  }
  console.log('\n❌ All common passwords failed.');
  process.exit(1);
}

test();
