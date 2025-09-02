import { Module } from "@nestjs/common";
import { TesteController } from "./teste.controller";
import { TesteService } from "./teste.service";
import { SupabaseModule } from "src/config/supabase.module";

@Module({
  imports: [SupabaseModule],
  controllers: [TesteController],
  providers: [TesteService],
})
export class TesteModule {}
