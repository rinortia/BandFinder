import { Link, NavLink, useNavigate } from 'react-router-dom'
import UserAvatar from '../UserAvatar'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-title">BandFinder</span>
          <span className="logo-sub">Найди свою группу</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/musicians">Музыканты</NavLink>
          <NavLink to="/ads">Объявления</NavLink>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="user-chip">
                <UserAvatar name={user?.name || ''} photo={user?.profile?.photo} />
                <span>{user?.name}</span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Войти</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
