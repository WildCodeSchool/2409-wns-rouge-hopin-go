// utils/ensureLambdaUser.ts
import argon2 from "argon2";
import { User } from "../entities/User";

export const LAMBDA_EMAIL = "";

export async function ensureLambdaUser(): Promise<User> {
  let u = await User.findOne({ where: { email: LAMBDA_EMAIL } });
  if (u) return u;

  const hashedPassword = await argon2.hash(
    // mot de passe impossible à deviner / inutilisable
    `deleted:${Date.now()}:${Math.random()}`
  );

  u = User.create({
    email: LAMBDA_EMAIL,
    firstName: "Supprimé",
    lastName: "Utilisateur",
    role: "user",
    hashedPassword,
  });

  await u.save();
  return u;
}
