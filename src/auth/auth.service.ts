import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { schema } from "src/db/schema";
import argon2 from "argon2";
import {
  AuthResponse,
  CreateUserDto,
  GoogleUser,
  JwtPayload,
  LoginDto,
  User,
} from "./types/auth.types";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createProfile(user: CreateUserDto): Promise<User> {
    const result = await db
      .insert(schema.users)
      .values({
        email: user.email,
        name: user.name,
        profilePicture: user.picture || "https://i.ibb.co/4pDNDk1/avatar.png",
        password: user.password,
      })
      .returning();
    const { password, ...userWithoutPassword } = result[0];
    return userWithoutPassword;
  }

  async getProfile(data: LoginDto): Promise<User> {
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
    return {
      ...userProfile,
      profilePicture:
        userProfile.profilePicture || "https://i.ibb.co/4pDNDk1/avatar.png",
    };
  }

  async verifyEmail(data: { email: string }) {
    const userResult = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1);
    return userResult[0];
  }

  async generateJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(profile: any): Promise<GoogleUser> {
    return {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
    };
  }

  async handleGoogleLogin(googleUser: GoogleUser): Promise<AuthResponse> {
    const { email, name, picture, id: googleId } = googleUser;

    let user = await this.verifyEmail({ email });

    if (!user) {
      const result = await db
        .insert(schema.users)
        .values({
          email,
          name,
          profilePicture: picture || "https://i.ibb.co/4pDNDk1/avatar.png",
          password: await argon2.hash(googleId),
        })
        .returning();
      user = result[0];
    } else {
      const result = await db
        .update(schema.users)
        .set({
          name,
          profilePicture: picture || user.profilePicture,
        })
        .where(eq(schema.users.id, user.id))
        .returning();
      user = result[0];
    }

    const accessToken = await this.generateJwtToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture:
          user.profilePicture || "https://i.ibb.co/4pDNDk1/avatar.png",
        createdAt: user.createdAt,
      },
    };
  }
}
