import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import argon2 from "argon2";
import { response } from "express";

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

    const reponse = this.authService.createProfile({
      email: data.email,
      name: data.name,
      picture: "",
      password: passwordHash,
    });

    if (!reponse) {
      throw new BadRequestException("Erro ao criar o usuário");
    }

    return { message: "Usuário criado com sucesso", reponse };
  }

  @Get()
  async getProfile(@Body() data: { email: string; password: string }) {
    try {
      const reponse = await this.authService.getProfile({
        email: data.email,
        password: data.password,
      });

      if (!reponse) {
        throw new BadRequestException("Erro ao autenticar o usuário");
      }

      if (response.statusCode === 401) {
        throw new UnauthorizedException("Credenciais inválidas");
      }

      return { message: "Usuário autenticado com sucesso", reponse };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Erro ao autenticar o usuário");
    }
  }

  // Google
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return req.user;
  }
}
