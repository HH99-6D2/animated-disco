import { NestFactory } from '@nestjs/core';
import { UserAppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(UserAppModule, { cors: true });
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: false,
		}),
	);
	const config = new DocumentBuilder()
		.setTitle('User app for animated disco')
		.setDescription('User API Document for Animated Disco')
		.setVersion('1.0')
		.addTag('user')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(3000);
}
bootstrap();
