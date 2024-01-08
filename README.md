# 🔥 Backend service 🔥
Service manage using NodeJS

## Config
1. Tạo file .env dựa vào file mẫu (.env.example) bằng câu lệnh dưới

```bash
cp .env.example .env
```

2. Install dependencies.
```bash
npm install
```

## Technology
- **SQL database**: [PostgreSQL](https://www.postgresql.org)
- **ORM**: [Prisma](https://www.prisma.io)
- **Validation**: [Joi](https://joi.dev)
- **Logging**: [winston](https://github.com/winstonjs/winston) + [morgan](https://github.com/expressjs/morgan)
- **Process management**: [PM2](https://pm2.keymetrics.io)
- **Environment variables**: [dotenv](https://github.com/motdotla/dotenv) + [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security HTTP headers**: [helmet](https://helmetjs.github.io)
- **CORS**: [cors](https://github.com/expressjs/cors)
- **Compression**: [compression](https://github.com/expressjs/compression)
- **Docker support**
- **In-memory Cache**: [node-cache](https://github.com/node-cache/node-cache)

## Command
1. Run env dev
```bash
npm run dev
```
2. Run env product
```bash
npm start
```

3. Migrate database
```bash
npm run migrate
```

4. Seed data
```bash
npm run seed
```

5. Docker
```bash
# Cài và chạy postgresql
sudo docker compose up postgres -d
```
## Author
1. [Hoàng Bùi - K14](https://www.facebook.com/MyNameBVH)