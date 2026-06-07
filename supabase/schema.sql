-- =============================================
-- propertiesテーブルの定義とRLSポリシー
-- Supabase SQL Editorで実行してください
-- =============================================

-- propertiesテーブルを作成する
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT        NOT NULL,
  rent        INTEGER     NOT NULL,
  area        TEXT        NOT NULL,
  floor_plan  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLSを有効化する（未設定のままだと全ユーザーのデータが見えてしまう）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分の物件のみ参照できるポリシー
CREATE POLICY "自分の物件のみ参照" ON properties
  FOR SELECT USING (auth.uid() = user_id);

-- 自分の物件のみ挿入できるポリシー（user_idを自分のIDに強制）
CREATE POLICY "自分の物件のみ挿入" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の物件のみ更新できるポリシー
CREATE POLICY "自分の物件のみ更新" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分の物件のみ削除できるポリシー
CREATE POLICY "自分の物件のみ削除" ON properties
  FOR DELETE USING (auth.uid() = user_id);
