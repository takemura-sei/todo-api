# ルーターとコントローラーを分離してTodo CRUD APIを実装

## コミット情報
- **コミットハッシュ**: `07c8ceb`
- **日時**: 2026年3月29日 20:09

## このコミットで何をしたか？

今回の変更で、Todoアプリの基本的な機能（作成・取得・更新・削除）を3つのファイルに分けて実装しました。

## ファイル構成と役割

```
src/
├── index.ts                    # 玄関（アプリ全体の設定）
├── routes/
│   └── todos.ts               # 案内係（URLとアクションを繋ぐ）
└── controllers/
    └── todoController.ts      # 実務担当（実際の処理を行う）
```

---

## 各ファイルの役割を詳しく解説

### 1. `src/index.ts` - アプリケーションの玄関

**役割**: Webサーバーの大元。アプリ全体の基本設定を行う場所

#### このファイルがやっていること
```typescript
import express from 'express'           // Expressフレームワークを読み込み
import todosRouter from './routes/todos' // Todoのルーターを読み込み

const app = express()                   // Expressアプリを作成
const PORT = 3001                       // ポート番号を設定

app.use(express.json())                 // JSON形式のリクエストを理解できるように設定
app.use('/api/todos', todosRouter)      // /api/todosで始まるURLは、todosRouterに処理を任せる

app.listen(PORT, () => {                // サーバーを起動
  console.log(`Server running on http://localhost:${PORT}`)
})
```

#### 比喩で理解
- **レストランの入口**: お客さん（リクエスト）が来たら、適切な担当者に案内する
- **`app.use('/api/todos', todosRouter)`**: 「Todoに関する注文は、あちらのスタッフに聞いてください」という指示

---

### 2. `src/routes/todos.ts` - 案内係（ルーター）

**役割**: URLのパターンと、それに対応する処理を紐付ける

#### このファイルがやっていること
```typescript
import { Router } from "express"
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todoController'

const router = Router()

// URLと処理の対応表
router.get('/', getTodos)           // GET /api/todos → 全Todo取得
router.get('/:id', getTodoById)     // GET /api/todos/1 → ID=1のTodo取得
router.post('/', createTodo)        // POST /api/todos → 新規Todo作成
router.patch('/:id', updateTodo)    // PATCH /api/todos/1 → ID=1のTodo更新
router.delete('/:id', deleteTodo)   // DELETE /api/todos/1 → ID=1のTodo削除
```

#### 用語解説

**HTTPメソッド**（リクエストの種類）
- `GET`: データを取得したい
- `POST`: 新しいデータを作りたい
- `PATCH`: 既存のデータを更新したい
- `DELETE`: データを削除したい

**パス変数 `:id`**
- `:id`は「ここに番号が入る」という意味
- 例: `/api/todos/5` なら、`id`は`5`

#### 比喩で理解
- **メニュー表**: 「この料理が欲しい」→「じゃあこの調理師に作ってもらいます」
- 実際の調理（処理）はしない、誰に任せるかを決めるだけ

---

### 3. `src/controllers/todoController.ts` - 実務担当（コントローラー）

**役割**: 実際の処理（データの操作）を行う

#### データの保管場所
```typescript
let todos = [
  { id: 1, title: '買い物', done: false },
  { id: 2, title: '勉強', done: false },
]
```
- 現在は**メモリ内**にデータを保存（サーバーを再起動すると消える）
- 将来的にはデータベースに変更予定

---

#### 各関数の詳細解説

### 📋 `getTodos` - 全Todo取得

```typescript
export const getTodos = (req: Request, res: Response) => {
  res.json(todos)
}
```

**何をしているか**
1. `todos`配列を全部取得
2. JSON形式で返す

**使用例**
```bash
GET /api/todos
→ [{ id: 1, title: '買い物', done: false }, ...]
```

---

### 🔍 `getTodoById` - 特定のTodo取得

```typescript
export const getTodoById = (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.json(todo)
}
```

**何をしているか**
1. URLから`id`を取得（例: `/api/todos/1` → `id`は`1`）
2. `todos`配列から該当する`id`のTodoを探す
3. 見つかったらTodoを返す、見つからなかったら404エラー

**用語**
- `req.params.id`: URLの`:id`部分の値
- `Number()`: 文字列を数値に変換
- `find()`: 配列から条件に合うものを探す

---

### ➕ `createTodo` - 新しいTodo作成

```typescript
export const createTodo = (req: Request, res: Response) => {
  const { title } = req.body
  if (!title) {
    res.status(400).json({ message: 'title is required' })
    return
  }
  const newTodo = { id: Date.now(), title, done: false }
  todos.push(newTodo)
  res.status(201).json(newTodo)
}
```

**何をしているか**
1. リクエストボディから`title`を取得
2. `title`が空ならエラー（400 Bad Request）
3. 新しいTodoオブジェクトを作成
   - `id`: 現在時刻（ミリ秒）でユニークなIDを生成
   - `done`: 初期値は`false`
4. `todos`配列に追加
5. 作成したTodoを返す（201 Created）

**用語**
- `req.body`: POSTリクエストで送られたデータ
- `Date.now()`: 現在時刻（ミリ秒単位の数値）
- `push()`: 配列の最後に要素を追加

---

### ✏️ `updateTodo` - Todo更新

```typescript
export const updateTodo = (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  if (req.body.title !== undefined) todo.title = req.body.title
  if (req.body.done !== undefined) todo.done = req.body.done
  res.json(todo)
}
```

**何をしているか**
1. URLから`id`を取得して該当Todoを探す
2. 見つからなければ404エラー
3. リクエストボディに`title`があれば更新
4. リクエストボディに`done`があれば更新
5. 更新後のTodoを返す

**ポイント**
- `!== undefined`: 値が送られてきたかチェック
- 部分更新可能: `title`だけ、`done`だけの更新もOK

---

### 🗑️ `deleteTodo` - Todo削除

```typescript
export const deleteTodo = (req: Request, res: Response) => {
  todos = todos.filter(t => t.id !== Number(req.params.id))
  res.status(204).send()
}
```

**何をしているか**
1. URLから`id`を取得
2. `todos`配列から該当IDを除外した新しい配列を作る
3. 204 No Content（削除成功、返すデータなし）を返す

**用語**
- `filter()`: 条件に合う要素だけを残して新しい配列を作る
- `!==`: 「等しくない」という意味

---

## なぜファイルを分けるの？

### 1つのファイルにまとめた場合（悪い例）
```typescript
// index.ts に全部書く
app.get('/api/todos', (req, res) => {
  // ここに処理を直接書く
  res.json(todos)
})
app.get('/api/todos/:id', (req, res) => {
  // また処理を直接書く
  const todo = todos.find(...)
  res.json(todo)
})
// ... 延々と続く
```

**問題点**
- ファイルが長くなりすぎる
- どこに何があるか分かりにくい
- 修正時に影響範囲が不明確

### ファイルを分けた場合（良い例）
```typescript
// index.ts - 設定だけ
app.use('/api/todos', todosRouter)

// routes/todos.ts - URL定義だけ
router.get('/', getTodos)

// controllers/todoController.ts - 処理だけ
export const getTodos = (req, res) => { ... }
```

**メリット**
- 各ファイルの役割が明確
- 修正したい箇所がすぐ分かる
- テストが書きやすい
- チーム開発しやすい

---

## RESTful API の基本原則

今回のAPIは「RESTful」という設計原則に従っています。

| やりたいこと | HTTPメソッド | URL | 関数 |
|------------|------------|-----|------|
| 全部見る | GET | /api/todos | getTodos |
| 1つ見る | GET | /api/todos/:id | getTodoById |
| 作る | POST | /api/todos | createTodo |
| 更新する | PATCH | /api/todos/:id | updateTodo |
| 削除する | DELETE | /api/todos/:id | deleteTodo |

**ポイント**
- URLは「何のデータか」を表す（`/api/todos`）
- HTTPメソッドは「何をするか」を表す（GET, POST, PATCH, DELETE）

---

## 実際に使ってみる例

### 全Todo取得
```bash
curl http://localhost:3001/api/todos
```

### 新しいTodo作成
```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "新しいタスク"}'
```

### Todoを完了にする
```bash
curl -X PATCH http://localhost:3001/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

### Todo削除
```bash
curl -X DELETE http://localhost:3001/api/todos/1
```

---

## まとめ

### このコミットで学べること
1. **ファイルの役割分担**（MVCパターン）
2. **RESTful APIの基本**
3. **Expressでのルーティング**
4. **HTTPメソッドの使い分け**
5. **データのCRUD操作**

### 今後の拡張予定
- データベース接続（永続化）
- バリデーション強化
- エラーハンドリング統一
- 認証機能
