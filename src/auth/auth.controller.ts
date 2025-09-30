import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import argon2 from "argon2";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createProfile(
    @Body()
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }
  ) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException("As senhas não coincidem");
    }

    const passwordHash = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    if (!passwordHash) {
      throw new BadRequestException("Erro ao criar o usuário, senha inválida");
    }

    const emailExists = await this.authService.verifyEmail({
      email: data.email,
    });

    if (emailExists) {
      throw new ConflictException("Email já cadastrado");
    }

    const response = await this.authService.createProfile({
      email: data.email,
      name: data.name,
      picture: "",
      password: passwordHash,
    });

    if (!response) {
      throw new BadRequestException("Erro ao criar o usuário");
    }

    return { message: "Usuário criado com sucesso", response };
  }

  @Post("login")
  async login(@Body() data: { email: string; password: string }) {
    try {
      const response = await this.authService.getProfile({
        email: data.email,
        password: data.password,
      });

      if (!response) {
        throw new BadRequestException("Erro ao autenticar o usuário");
      }

      const token = await this.authService.generateJwtToken({
        sub: response.id,
        email: response.email,
        name: response.name,
      });

      return {
        message: "Usuário autenticado com sucesso",
        user: response,
        accessToken: token,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Credenciais inválidas");
    }
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() { }

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const googleUser = req.user;

      const result = await this.authService.handleGoogleLogin(googleUser);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendUrl}`);
      // res.redirect(
      //   `${frontendUrl}/auth/callback?token=${
      //     result.accessToken
      //   }&user=${encodeURIComponent(JSON.stringify(result.user))}`
      // );
    } catch (error) {
      console.error("Erro no Google OAuth:", error);
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error`
      );
    }
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getMe(@Req() req: any) {
    return {
      message: "Usuário autenticado",
      user: req.user,
    };
  }
}
