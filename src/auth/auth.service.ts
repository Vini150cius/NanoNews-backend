import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { schema } from "src/db/schema";
import argon2 from "argon2";

interface users {
  id: string;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createProfile(user: {
    email: string;
    name: string;
    picture: string;
    password: string;
  }) {
    const result = await db.insert(schema.users).values(user).returning();
    return result;
  }

  async getProfile(data: { email: string; password: string }) {
    const userResult = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        password: schema.users.password,
        name: schema.users.name,
        profilePicture: schema.users.profilePicture,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      throw new HttpException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
      throw new HttpException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);
    }

    const { password, ...userProfile } = user;
    return userProfile;
  }

  async verifyEmail(data: { email: string }) {
    const userResult = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1);
    return userResult[0];
  }

  async validateGoogleUser(profile: any) {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
    };

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { ...user, token };
  }
}
