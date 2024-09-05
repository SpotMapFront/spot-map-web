// import { Link, NavLink} from "react-router-dom"
import './appHeader.scss'

const AppHeader = () => {
  return (
    <header className='header'>
      <h1 className='header__title'>
        Spot
      </h1>
      <nav className='header__menu'>
        <ul>
          <li>Main</li>
          <li>About</li>
          <li>Contact</li>
          <li>Profile</li>
        </ul>
      </nav>
    </header>
  )
}

export default AppHeader