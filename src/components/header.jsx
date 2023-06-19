import logo from '../assets/media/img/logo.png'
import 'bootstrap/dist/css/bootstrap.css'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Link } from 'react-router-dom'

function Header () {
  const link = {
    index: '/',
    members: '/members',
    mailto: 'mailto: info@Tgif.net',
    house: '/members/house',
    congress: '/members/congress'
  }
  return (
    <header>
      <div className='logo'>
        <img className='img-fluid' src={logo} alt='Logo' />
        <h1>Senators</h1>
        <div className='mailto'>
          <a href={link.mailto}>Info@Tgif.net</a>
        </div>
      </div>

      <Nav variant='pills' activeKey='1'>
        <Link className='nav-link active' to={link.index}>
          Home
        </Link>

        <DropdownButton id='dropdown-item-button' title='Congress '>
          <a href={link.house} className='dropdownItem'>
            <Dropdown.Item as='button' eventKey='2.1'>
              House
            </Dropdown.Item>
          </a>

          <a href={link.congress} className='dropdownItem'>
            <Dropdown.Item as='button' eventKey='2.2'>
              Senate
            </Dropdown.Item>
          </a>
        </DropdownButton>
      </Nav>
    </header>
  )
}

export default Header
