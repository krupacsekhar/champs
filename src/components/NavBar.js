import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import SearchBar from './SearchBar';
import Champs_logo from '../assets/img/Champs_logo.png';
import AudioPlayer from './AudioPlayer';
import sarawak_anthem from '../assets/sarawak_anthem.m4a';
import { useMediaQuery } from 'react-responsive';

function NavBar({ user }) {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 }); // If you're using 'react-responsive'
  const [showSearchBarInOffcanvas, setShowSearchBarInOffcanvas] = useState(isSmallScreen);

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
              <Navbar.Brand href="/home" className="nav-logo" onClick={handleLogout}>
                <img src={Champs_logo} className="champs_logo" alt="Champs Logo" />
              </Navbar.Brand>
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
                  <Nav.Link href="/home" className="nav-link" onClick={handleLogout}>
                    Log In
                  </Nav.Link>
                  <div style={{ marginTop: '20px', marginLeft: '25px' }}>
                    <AudioPlayer audioUrl={sarawak_anthem} />
                  </div>
                </>
              ) :
                user === 'HeritageExpert' || user === 'User' ? (
                  <>
                    <Nav.Link href="/manage-task" className="nav-link">
                      Manage Task
                    </Nav.Link>
                    <Nav.Link href="/map" className="nav-link">
                      Map
                    </Nav.Link>
                    <Nav.Link href="/search-page" className="nav-link">
                      Search
                    </Nav.Link>
                    <Nav.Link href="/upload" className="nav-link">
                      Upload
                    </Nav.Link>
                    <Nav.Link href="/favorites" className="nav-link">
                      Favorites
                    </Nav.Link>
                    <Nav.Link href="/manage-profile" className="nav-link">
                      Manage Profile
                    </Nav.Link>
                    <Nav.Link href="/home" className="nav-link" onClick={handleLogout}>
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
                    <Nav.Link href="/home" className="nav-link" onClick={handleLogout}>
                      Log Out
                    </Nav.Link>
                  </>
                )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
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

  return location.pathname === '/home' ? null : layout;
}

export default NavBar;
