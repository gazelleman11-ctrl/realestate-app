import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import styles from './Properties.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'パークヒルズ渋谷', rent: 180000, area: '渋谷区', rooms: '2LDK', image: '🏢' },
  { id: 2, name: 'グランドコート新宿', rent: 220000, area: '新宿区', rooms: '3LDK', image: '🏙️' },
  { id: 3, name: 'サニーハイツ品川', rent: 120000, area: '品川区', rooms: '1LDK', image: '🏠' },
  { id: 4, name: 'リバーサイド江東', rent: 95000, area: '江東区', rooms: '1K', image: '🏡' },
  { id: 5, name: 'タワーレジデンス豊洲', rent: 350000, area: '江東区', rooms: '3LDK', image: '🗼' },
  { id: 6, name: 'ガーデンコート世田谷', rent: 145000, area: '世田谷区', rooms: '2LDK', image: '🌳' },
]

export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    // ログアウト後はログイン画面へ遷移
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
          <span className={styles.count}>{DUMMY_PROPERTIES.length} 件</span>
        </div>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardImage}>{property.image}</div>
              <div className={styles.cardBody}>
                <h3 className={styles.propertyName}>{property.name}</h3>
                <div className={styles.tags}>
                  <span className={styles.tag}>{property.area}</span>
                  <span className={styles.tag}>{property.rooms}</span>
                </div>
                <p className={styles.rent}>
                  <span className={styles.rentLabel}>月額家賃</span>
                  <span className={styles.rentValue}>
                    ¥{property.rent.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
