import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import type { AuthService } from "./auth.service";

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

    const reponse = this.authService.createProfile({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!reponse) {
      throw new BadRequestException("Erro ao criar o usuário");
    }

    return { message: "Usuário criado com sucesso", reponse };
  }

  @Get()
  async getProfile(@Body() data: { email: string; password: string }) {
    const reponse = this.authService.getProfile({
      email: data.email,
      password: data.password,
    });
    if (!reponse) {
      throw new BadRequestException("Erro ao autenticar o usuário");
    }
    return { message: "Usuário autenticado com sucesso", reponse };
  }
}
