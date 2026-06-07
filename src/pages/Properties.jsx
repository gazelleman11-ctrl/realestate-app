import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import styles from './Properties.module.css'

// フォームの初期値
const EMPTY_FORM = { name: '', rent: '', area: '', floor_plan: '' }

export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // showForm: 'add' | 'edit' | null
  const [showForm, setShowForm] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  // マウント時に物件一覧を取得する
  useEffect(() => {
    fetchProperties()
  }, [])

  // Supabaseから自分の物件一覧を取得する
  async function fetchProperties() {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
      setError('')
    }
    setLoading(false)
  }

  // 物件を新規登録する（INSERT）
  async function handleAdd(e) {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('properties').insert({
      name: form.name,
      rent: parseInt(form.rent, 10),
      area: form.area,
      floor_plan: form.floor_plan,
      user_id: user.id,
    })
    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      closeForm()
      fetchProperties()
    }
    setSubmitting(false)
  }

  // 編集フォームを開く
  function openEdit(property) {
    setEditTarget(property)
    setForm({
      name: property.name,
      rent: String(property.rent),
      area: property.area,
      floor_plan: property.floor_plan,
    })
    setShowForm('edit')
    setError('')
  }

  // 物件情報を更新する（UPDATE）
  async function handleUpdate(e) {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase
      .from('properties')
      .update({
        name: form.name,
        rent: parseInt(form.rent, 10),
        area: form.area,
        floor_plan: form.floor_plan,
      })
      .eq('id', editTarget.id)
    if (error) {
      setError('更新に失敗しました: ' + error.message)
    } else {
      closeForm()
      fetchProperties()
    }
    setSubmitting(false)
  }

  // 物件を削除する（DELETE）
  async function handleDelete(id) {
    if (!window.confirm('この物件を削除しますか？')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      fetchProperties()
    }
  }

  // フォームを閉じて状態をリセットする
  function closeForm() {
    setShowForm(null)
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  // ログアウト処理
  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>不動産管理アプリ</h1>
          <div className={styles.headerRight}>
            <span className={styles.email}>{user?.email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h2 className={styles.pageTitle}>物件一覧</h2>
          <span className={styles.count}>{properties.length} 件</span>
          <button
            className={styles.addButton}
            onClick={() => { setShowForm('add'); setForm(EMPTY_FORM); setError('') }}
          >
            ＋ 物件を登録
          </button>
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        {/* 新規登録・編集フォーム */}
        {showForm && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>
              {showForm === 'add' ? '物件を新規登録' : '物件を編集'}
            </h3>
            <form
              onSubmit={showForm === 'add' ? handleAdd : handleUpdate}
              className={styles.form}
            >
              <label className={styles.label}>物件名</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="例：パークヒルズ渋谷"
              />
              <label className={styles.label}>エリア</label>
              <input
                className={styles.input}
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                required
                placeholder="例：渋谷区"
              />
              <label className={styles.label}>間取り</label>
              <input
                className={styles.input}
                value={form.floor_plan}
                onChange={(e) => setForm({ ...form, floor_plan: e.target.value })}
                required
                placeholder="例：1LDK"
              />
              <label className={styles.label}>家賃（円）</label>
              <input
                className={styles.input}
                type="number"
                value={form.rent}
                onChange={(e) => setForm({ ...form, rent: e.target.value })}
                required
                min="0"
                placeholder="例：150000"
              />
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={submitting}>
                  {submitting ? '処理中...' : (showForm === 'add' ? '登録する' : '更新する')}
                </button>
                <button type="button" className={styles.cancelButton} onClick={closeForm}>
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 物件カード一覧 */}
        {loading ? (
          <p className={styles.loadingMsg}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className={styles.emptyMsg}>
            物件が登録されていません。「＋ 物件を登録」から追加してください。
          </p>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardImage}>🏢</div>
                <div className={styles.cardBody}>
                  <h3 className={styles.propertyName}>{property.name}</h3>
                  <div className={styles.tags}>
                    <span className={styles.tag}>{property.area}</span>
                    <span className={styles.tag}>{property.floor_plan}</span>
                  </div>
                  <p className={styles.rent}>
                    <span className={styles.rentLabel}>月額家賃</span>
                    <span className={styles.rentValue}>
                      ¥{property.rent.toLocaleString()}
                    </span>
                  </p>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEdit(property)}
                    >
                      編集
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(property.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
