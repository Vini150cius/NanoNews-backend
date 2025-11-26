import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(
    @Body()
    body: {
      article: { headline: string; createdAt: string; authorId: string }; 
      content: { order: number; typeComponent: string; content: string }[];
    }
  ) {
    return this.articlesService.create(body);
  }
}