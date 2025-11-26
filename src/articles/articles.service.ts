import { Injectable } from "@nestjs/common";
import { db } from "../db/connection";
import { schema } from "../db/schema";

@Injectable()
export class ArticlesService {
  async create(payload: {
    article: { headline: string; createdAt: string; authorId: string };
    content: { order: number; typeComponent: string; content: string }[];
  }) {
    const { article, content } = payload;

    const [articleData] = await db
      .insert(schema.articles)
      .values({
        uuidAuthor: article.authorId,
        headline: article.headline,
        createdAt: new Date(article.createdAt),
      })
      .returning();

    if (content.length > 0) {
      const contentsToInsert = content.map((item) => ({
        idArticle: articleData.id,
        order: item.order,
        typeComponent: item.typeComponent,
        content: item.content,
      }));

      await db.insert(schema.content_of_article).values(contentsToInsert);

      return { article: articleData, content: contentsToInsert };
    }

    return { article: articleData, content: [] };
  }
}