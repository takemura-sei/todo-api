# Todo API - Express + TypeScript + Prisma

モダンなバックエンド技術とベストプラクティスで構築された、ユーザー認証付きTodo管理用の本番環境対応REST API。

## 概要

### なぜこのプロジェクトを作ったか

TypeScript、ORM統合、安全な認証パターンを使用したバックエンド開発スキルを示すために作成しました。このプロジェクトはクリーンなアーキテクチャと関心の分離を実装しています。

### 何ができるか

- JWTトークンによるユーザー認証
- Todoの完全なCRUD操作
- データベース制約付きユーザー-Todo関係
- Prisma ORMによる型安全なデータベースクエリ
- Supabase経由のPostgreSQLデータベース

## 技術スタック

- **ランタイム**: Node.js 18+
- **フレームワーク**: Express.js 5.2+
- **言語**: TypeScript 6.0+
- **ORM**: Prisma 7.6+ (PostgreSQLアダプター付き)
- **データベース**: Supabase PostgreSQL
- **認証**: JWT (jsonwebtoken) + bcrypt
- **開発ツール**: nodemon、ts-node

## 主要な技術的成果

### アーキテクチャとデザインパターン

- **MVCパターン**: ルート、コントローラー、ビジネスロジックのクリーンな分離
- **Prisma ORM統合**: 自動マイグレーションサポート付き型安全データベースクエリ
- **ミドルウェアアーキテクチャ**: ルート保護のための再利用可能な認証ミドルウェア
- **エラーハンドリング**: 適切なHTTPステータスコード付き集中型エラーハンドリング

### データベース設計

- **リレーショナルスキーマ**: ユーザー-Todo一対多関係
- **Prisma 7.xマイグレーション**: PostgreSQLアダプターを使用した最新Prismaへのアップグレード成功
- **コネクションプーリング**: Prismaコネクションプールによる最適化されたデータベース接続

### セキュリティ

- **パスワードハッシング**: ソルトラウンド付きbcrypt
- **JWT認証**: 有効期限付き安全なトークンベース認証
- **環境変数**: .envで分離された機密認証情報
- **入力バリデーション**: 全エンドポイントのリクエストバリデーション

## プロジェクト構造

```
src/
├── controllers/
│   └── todoController.ts    # Todo CRUDのビジネスロジック
├── routes/
│   └── todos.ts             # APIエンドポイント定義
├── lib/
│   └── prisma.ts            # Prismaクライアントシングルトン
├── middleware/
│   └── auth.ts              # JWT認証ミドルウェア
└── index.ts                 # Expressアプリエントリーポイント

prisma/
├── schema.prisma            # データベーススキーマ定義
└── migrations/              # データベースマイグレーション
```

## データベーススキーマ

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

## APIエンドポイント

### 認証

```
POST   /api/auth/register    新規ユーザー登録
POST   /api/auth/login       ログインしてJWTトークンを取得
GET    /api/auth/me          現在のユーザー情報を取得（保護）
```

### Todo

```
GET    /api/todos            現在のユーザーの全Todoを取得
POST   /api/todos            新規Todo作成
GET    /api/todos/:id        特定のTodoを取得
PUT    /api/todos/:id        Todoを更新
DELETE /api/todos/:id        Todoを削除
```

### リクエスト例

**ユーザー登録:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "田中太郎"
  }'
```

**ログイン:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Todo作成（JWTトークンが必要）:**

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Prismaを学ぶ",
    "description": "Prisma ORMチュートリアルを完了する",
    "completed": false
  }'
```

## セットアップ手順

### 前提条件

- Node.js 18+
- PostgreSQLデータベース（Supabase推奨）

### Supabaseセットアップ

1. [supabase.com](https://supabase.com)で無料アカウントを作成
2. 新しいプロジェクトを作成
3. Project Settings > DatabaseからPostgreSQL接続文字列を取得
4. 注：Prismaスキーマが最初のマイグレーション時に自動的にテーブルを作成します

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/takemura-sei/todo-api.git
cd todo-api

# 依存関係をインストール
npm install

# .envファイルを作成（.env.exampleからコピー）
cp .env.example .env

# .envに認証情報を編集:
# DATABASE_URL="postgresql://user:password@host:5432/database"
# JWT_SECRET="your-secret-key"

# Prismaクライアントを生成
npx prisma generate

# データベースマイグレーションを実行
npx prisma migrate dev

# オプション：サンプルデータでデータベースをシード
npx prisma db seed

# 開発サーバーを起動
npm run dev
```

APIは`http://localhost:3000`で利用可能になります

### 環境変数

必要な環境変数は`.env.example`を参照:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
JWT_SECRET="your-secret-key-here"
```

安全なJWTシークレットを生成:

```bash
openssl rand -base64 64
```

## 認証フロー

1. ユーザーが`/api/auth/register`経由で登録
2. bcryptでパスワードをハッシュ化
3. ユーザーが`/api/auth/login`経由でログイン
4. ユーザーIDと有効期限付きJWTトークンを返却
5. クライアントが`Authorization: Bearer <token>`ヘッダーにトークンを含める
6. 認証ミドルウェアが保護されたルートでトークンを検証
7. データベースクエリのためにトークンからユーザーIDを抽出

## 学んだこと

- **Prisma ORM**: スキーマ設計、マイグレーション、型安全クエリの習得
- **TypeScript バックエンド**: Expressアプリ全体で完全な型安全性を実装
- **JWT認証**: 安全なトークンベース認証システムの設計
- **データベースリレーションシップ**: 外部キー付き一対多関係のモデリング
- **MVCアーキテクチャ**: 保守性と拡張性のためのコード構造化
- **Prisma 7.xマイグレーション**: PostgreSQLアダプター付き最新Prismaへのアップグレード成功

## 今後の改善予定

- ユニットテストと統合テストの追加（Jest）
- APIエンドポイントのレート制限実装
- Todoカテゴリーとタグの追加
- ユーザー間でのTodo共有機能実装
- Todo期限日とリマインダーの追加
- OpenAPI/Swaggerドキュメントの作成
- Dockerコンテナ化の追加
- Redisによるキャッシング実装
- GraphQLエンドポイントの代替追加

## ライセンス

MITライセンス
