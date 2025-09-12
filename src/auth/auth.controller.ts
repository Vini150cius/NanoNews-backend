import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";

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

    return this.authService.createProfile({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }
}
