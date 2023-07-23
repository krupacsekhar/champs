import locationIcon from '../assets/img/LocationPin.svg';

const LocationPin = ({ text }) => (
  <div className="pin">
    <button onClick={() => onUpdateActiveLink('/')}>{locationIcon}</button>
    <p className="pin-text">{text}</p>
  </div>
)