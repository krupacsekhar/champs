import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import SearchBar from './SearchBar';
import Champs_logo from '../assets/img/Champs_logo.png';
import AudioPlayer from './AudioPlayer';
import sarawak_anthem from '../assets/sarawak_anthem.mp3';
import { useMediaQuery } from 'react-responsive';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

function NavBar({ user }) {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 }); // If you're using 'react-responsive'
  const [showSearchBarInOffcanvas, setShowSearchBarInOffcanvas] = useState(isSmallScreen);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'logo-popup' : undefined;

  useEffect(() => {
    setShowSearchBarInOffcanvas(isSmallScreen);
  }, [isSmallScreen]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    navigate('/home');
  };

  const searchBarOffcanvas =
    showSearchBarInOffcanvas ? (<SearchBar />) : (<div></div>)


  const searchBarReg =
    showSearchBarInOffcanvas ? (<div></div>) : (<SearchBar />)


  const layout = (
    <Navbar bg="light" expand="xxl" className="mb-3">
      <Container fluid>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          className="nav-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-center flex-wrap-nowrap">
              <>
                <Navbar.Brand
                  className="nav-logo"
                  onClick={handleClick}
                  aria-describedby={id}
                >
                  <img src={Champs_logo} className="champs_logo" alt="Champs Logo" />
                </Navbar.Brand>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography sx={{ p: 2, maxWidth: 250 }}>
                    <b>Crowdsourced Heritage Automation Mapping Platform for Sarawak (CHAMPS).</b>
                    <br />
                    <br />
                    CHAMPS aims to collect and map cultural heritage within the different
                    communities of the Sarawak region in Malaysia, specifically within the
                    Kuching Division. By cataloging both tangible and intangible cultural
                    heritage and developing a collaborative platform, CHAMPS seeks to enable
                    the people of Sarawak to explore and share their unique identities with
                    the rest of the world.
                  </Typography>
                </Popover>
              </>
              <hr className="nav-hr" />
              {searchBarOffcanvas}

              {user === '' ? (
                <>
                  <Nav.Link href="/map" className="nav-link">
                    Map
                  </Nav.Link>
                  <Nav.Link href="/search-page" className="nav-link">
                    Search
                  </Nav.Link>
                  <Nav.Link href="/log-in" className="nav-link" onClick={handleLogout}>
                    Log In
                  </Nav.Link>

                </>
              ) :
                user === 'HeritageExpert' || user === 'User' ? (
                  <>
                    <Nav.Link href="/map" className="nav-link">
                      Map
                    </Nav.Link>
                    <Nav.Link href="/upload" className="nav-link">
                      Upload
                    </Nav.Link>
                    <Nav.Link href="/search-page" className="nav-link">
                      Search
                    </Nav.Link>
                    <Nav.Link href="/favorites" className="nav-link">
                      Favorites
                    </Nav.Link>
                    <Dropdown as={Nav.Item}>
                      <Dropdown.Toggle as={Nav.Link} className="nav-link">
                        Manage
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="/manage-profile">Manage Profile</Dropdown.Item>
                        <Dropdown.Item href="/manage-task">Manage Task</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Link href="/map" className="nav-link" onClick={handleLogout}>
                      Log Out
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/map" className="nav-link">
                      Map
                    </Nav.Link>
                    <Nav.Link href="/search-page" className="nav-link">
                      Search
                    </Nav.Link>
                    <Nav.Link href="/favorites" className="nav-link">
                      Favorites
                    </Nav.Link>
                    <Nav.Link href="/manage-profile" className="nav-link">
                      Manage Profile
                    </Nav.Link>
                    <Nav.Link href="/map" className="nav-link" onClick={handleLogout}>
                      Log Out
                    </Nav.Link>
                  </>
                )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        {user === '' ? (
          <div style={{ marginTop: '20px', marginLeft: '0px' }}>
            <AudioPlayer audioUrl={sarawak_anthem} />
          </div>) : (<div></div>)}
        <Nav>

          {searchBarReg}
        </Nav>
      </Container>
    </Navbar>
  );

  const excludedRoutes = ['/home', '/login', '/signup', '/signup-user', '/signup-admin', '/signup-expert'];

  const shouldDisplayNavbar = !excludedRoutes.includes(location.pathname);

  useEffect(() => {
    if (!shouldDisplayNavbar) {
      // Redirect to the home page or handle the exclusion logic as needed
    }
  }, [location.pathname, shouldDisplayNavbar]);

  return location.pathname === '/log-in' ? null : layout;
}

export default NavBar;
