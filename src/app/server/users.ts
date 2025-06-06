'use server'

import { auth } from "@/lib/auth";
import { client } from "@/lib/db";

type SignInWithEmail = {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const signInWithEmail = async ({ email, password, rememberMe = false }: SignInWithEmail) => {
  await auth.api.signInEmail({
    body: { 
      email, 
      password, 
      callbackURL: '/',
      rememberMe
    }
  })
}

type SignUpWithEmailParams = {
  email: string;
  name: string;
  password: string;
}

export const signUpWithEmail = async ({ email, name, password }: SignUpWithEmailParams) => {
  await auth.api.signUpEmail({
    body: { email, name, password, callbackURL: '/', }
  })
}

export const isUserChef = async (userId: string): Promise<boolean> => {
  try {
    const result = await client.execute({
      sql: 'SELECT id FROM chefs WHERE userId = ?',
      args: [userId]
    });
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking if user is chef:', error);
    return false;
  }
}

export const getUserChefInfo = async (userId: string) => {
  try {
    const result = await client.execute({
      sql: `SELECT 
        c.id,
        c.bio,
        c.specialties,
        c.verified,
        c.profileImage,
        c.socialLinks,
        co.name as countryName,
        co.flag as countryFlag
      FROM chefs c
      LEFT JOIN countries co ON c.countryId = co.id
      WHERE c.userId = ?`,
      args: [userId]
    });
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error getting chef info:', error);
    return null;
  }
}