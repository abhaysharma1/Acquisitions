import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.models.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing the password:', error);
    throw new Error('Error Hashing');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error comparing the password:', error);
    throw new Error('Error Comparing');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User Already Exists');
    }

    const password_hash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info('User', newUser.email, 'created successfully');
    return newUser;
  } catch (error) {
    logger.error('Error Creating the User:', error);
    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    logger.info('User', safeUser.email, 'authenticated successfully');
    return safeUser;
  } catch (error) {
    logger.error('Error Authenticating the User:', error);
    throw error;
  }
};
