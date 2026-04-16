import 'dotenv/config';

import { auth } from '~/server/better-auth';
import { db } from './index';
import { user } from './schema';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  const adminEmail = 'admin@powerplaza.com';
  const adminPassword = 'admin1234';

  // Check if admin already exists
  const existing = await db.select().from(user).where(eq(user.email, adminEmail));

  if (existing.length > 0) {
    console.log('✓ Admin user already exists, ensuring admin role...');
    await db.update(user).set({ role: 'admin' }).where(eq(user.email, adminEmail));
    console.log('✓ Admin role confirmed');
    return;
  }

  // Create admin user via better-auth API (properly hashes password, creates account record)
  try {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
      },
    });

    // Update role to admin (signUpEmail creates with default 'user' role)
    await db.update(user).set({ role: 'admin' }).where(eq(user.email, adminEmail));

    console.log('✓ Admin user created');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('  Role: admin');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('already') || message.includes('unique')) {
      console.log('✓ Admin user already exists, ensuring admin role...');
      await db.update(user).set({ role: 'admin' }).where(eq(user.email, adminEmail));
      console.log('✓ Admin role confirmed');
    } else {
      throw error;
    }
  }
}

seedAdmin().catch(console.error);