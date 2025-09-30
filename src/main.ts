import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.listen(env.PORT);
  console.log(`Servidor rodando na porta ${env.PORT}`);
}
bootstrap();