import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import hornbill from '../assets/img/hornbill.png';
import { Nav, NavLink, NavMenu } from "../components/HomeNav";
import Champs_home from "../assets/img/Champs_logo.png";
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
    const [activeLink, setActiveLink] = useState('home');
    const onUpdateActiveLink = () => {
        setActiveLink("skills");
    }

    return (
        <section className="banner" id="home">
            <Container className="banner-container">
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <h1><img src={Champs_home} alt="Champs_home" /></h1>
                        <h4>Welcome to Sarawak!</h4>
                        <br />
                        <div className="d-flex flex-column align-items-center">
                            <div>
                                <button className="button-2" onClick={() => onUpdateActiveLink('sign-in')}>
                                    <NavLink to="/login" onClick={() => onUpdateActiveLink('sign-in')}>SIGN IN</NavLink>
                                </button>
                            </div>
                            <div>
                                <button className="button-2" onClick={() => onUpdateActiveLink('sign-up')}>
                                    <NavLink to="/signup-user" onClick={() => onUpdateActiveLink('sign-up')}>SIGN UP</NavLink>
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {/* Center-align the text */}
                    <Typography variant="body1" sx={{ color: 'grey', marginTop: '10px', textAlign: 'center' }}>
                        Don't want to register?{' '} <br />
                        <Link component={RouterLink} to="/map" sx={{ color: 'grey', '&:hover': { color: '#335058' } }}>
                            Proceed as guest.
                        </Link>
                    </Typography>
                </Row>
            </Container>
            <Container className="banner-container">
                <img src={hornbill} alt="Hornbill" />
            </Container>
        </section>
    )
}

export default HomePage;
