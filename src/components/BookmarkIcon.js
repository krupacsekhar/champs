import React from 'react';
import PropTypes from 'prop-types';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

const BookmarkIcon = ({ isBookmarked, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      {isBookmarked ? (
        <FavoriteIcon fontSize="small" style={{ fill: '#FF0000' }} />
      ) : (
        <FavoriteBorderOutlinedIcon fontSize="small" style={{ stroke: '#FF0000' }} />
      )}
    </div>
  );
};

BookmarkIcon.propTypes = {
  isBookmarked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BookmarkIcon;
