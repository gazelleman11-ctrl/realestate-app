# Real Estate App — Claude Code Guide

## Project Overview

不動産アプリケーション。詳細はプロジェクトが進むにつれて更新すること。

## Git 運用ルール

**コードを変更するたびに必ず GitHub へプッシュすること。**

### 手順

1. 変更をステージング・コミット
2. リモートへプッシュ

```powershell
git add <変更ファイル>
git commit -m "コミットメッセージ"
git push origin main
```

### コミットメッセージ規則

- 日本語・英語どちらも可
- 変更内容を簡潔に記述する
- `feat:`, `fix:`, `refactor:`, `docs:` などのプレフィックスを使う

例:
```
feat: 物件一覧ページを追加
fix: 検索フィルターのバグを修正
docs: README を更新
```

### ブランチ戦略

- `main`: 本番相当の安定ブランチ
- 機能追加は feature ブランチを切って作業し、完了後に main へマージ

```powershell
git checkout -b feature/your-feature-name
# 作業後
git checkout main
git merge feature/your-feature-name
git push origin main
```

## デプロイ情報

- 本番URL：https://realestate-app-ochre.vercel.app
- Supabaseプロジェクト名：realestate-app

## 開発ルール

- コードを変更したら必ずプッシュ（作業の記録として残す）
- 大きな変更を加える前にブランチを切る
- 破壊的な変更（ファイル削除・DB スキーマ変更など）は事前にユーザーへ確認する
- コメントは原則書かない。理由が非自明な場合のみ一行で記述する
