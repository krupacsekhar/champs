import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import hornbill from '../assets/img/hornbill.png';
import { Nav, NavLink, NavMenu }
    from "../components/HomeNav";
import Champs_home from "../assets/img/Champs_logo.png";


const HomePage = () => {
    const [activeLink, setActiveLink] = useState('home');
    const onUpdateActiveLink = () => {
        setActiveLink("skills");
    }

    return (
        <section className="banner" id="home">
            <Container className="banner-container">
                <div class="row justify-content-center">
                    <div class="col-10">
                        <h1><img src={Champs_home} /></h1>
                        <br />
                        <button className="button-1" onClick={() => onUpdateActiveLink('map')}
                        ><NavLink to="/map" onClick={() => onUpdateActiveLink('map')}>GUEST</NavLink></button>
                        <button className="button-2" onClick={() => onUpdateActiveLink('sign-in')}
                        ><NavLink to="/login" onClick={() => onUpdateActiveLink('sign-in')}>SIGN IN</NavLink></button>
                        <button className="button-3" onClick={() => onUpdateActiveLink('sign-up')}
                        ><NavLink to="/signup-user" onClick={() => onUpdateActiveLink('sign-up')}>SIGN UP</NavLink></button>
                    </div>
                </div>
            </Container>
            <Container className="banner-container">

                <img src={hornbill}></img>
            </Container>

        </section>
    )
}
export default HomePage;