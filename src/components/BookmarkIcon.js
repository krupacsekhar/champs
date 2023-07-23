import React from 'react';
import PropTypes from 'prop-types';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

const BookmarkIcon = ({ isBookmarked, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      {isBookmarked ? (
        <BookmarkOutlinedIcon fontSize="small" style={{ fill: '#335058' }} />
      ) : (
        <BookmarkBorderOutlinedIcon fontSize="small" style={{ stroke: '#335058' }} />
      )}
    </div>
  );
};

BookmarkIcon.propTypes = {
  isBookmarked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BookmarkIcon;
