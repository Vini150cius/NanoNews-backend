import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async createProfile(data: { name: string; email: string; password: string }) {
    const { data: user, error } =
      await this.supabaseService.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            displayName: data.name,
          },
        },
      });
    if (error) throw error;
    return user;
  }
}
