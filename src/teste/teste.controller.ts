import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type { TesteService } from "./teste.service";

@Controller("teste")
export class TesteController {
  constructor(private readonly testeService: TesteService) {}

  @Get()
  findAll() {
    return this.testeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testeService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { name: string; age: number }) {
    return this.testeService.create(body);
  }

  @Put(":id")
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; age?: number }
  ) {
    return this.testeService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testeService.remove(Number(id));
  }
}
