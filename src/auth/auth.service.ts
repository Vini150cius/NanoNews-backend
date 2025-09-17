import { Injectable } from "@nestjs/common";
import type { SupabaseService } from "../config/supabase.service";

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

  async getProfile(data: { email: string; password: string }) {
    const { data: user, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
    if (error) throw error;
    console.log(user);
    const dataUser = {
      uuid: user.user.id,
      email: user.user.email,
      name: user.user.user_metadata?.displayName,
      session: user.session,
    };
    console.log("banan", dataUser);
    return dataUser;
  }
}
