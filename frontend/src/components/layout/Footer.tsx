import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">BandFinder</div>
          <p className="footer-tagline">Платформа для поиска музыкантов и создания групп</p>
        </div>
        <div>
          <h4>Навигация</h4>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/musicians">Музыканты</Link></li>
            <li><Link to="/ads">Объявления</Link></li>
          </ul>
        </div>
        <div>
          <h4>Помощь</h4>
          <ul>
            <li><span>Как это работает</span></li>
            <li><span>Правила</span></li>
            <li><span>FAQ</span></li>
          </ul>
        </div>
        <div>
          <h4>Контакты</h4>
          <ul>
            <li>info@bandfinder.ru</li>
            <li>+7 (999) 123-45-67</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        © 2026 BandFinder
      </div>
    </footer>
  )
}
