import { Injectable } from "@nestjs/common";
import { SupabaseService } from "./../config/supabase.service";

@Injectable()
export class TesteService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.supabase
      .from("users")
      .select("*");
    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(user: { name: string; age: number }) {
    const { data, error } = await this.supabaseService.supabase
      .from("users")
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: number, user: { name?: string; age?: number }) {
    const { data, error } = await this.supabaseService.supabase
      .from("users")
      .update(user)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { error } = await this.supabaseService.supabase
      .from("users")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }
}
