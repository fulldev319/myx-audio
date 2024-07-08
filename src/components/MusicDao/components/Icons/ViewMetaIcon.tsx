import * as React from 'react';

const ViewIcon = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.999 11.667a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334Z"
      fill={props.fill || '#2D3047'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.668 10s2.5-5.833 8.333-5.833c5.834 0 8.334 5.833 8.334 5.833s-2.5 5.833-8.334 5.833C4.168 15.833 1.668 10 1.668 10Zm11.667 0a3.333 3.333 0 1 1-6.667 0 3.333 3.333 0 0 1 6.667 0Z"
      fill={props.fill || '#2D3047'}
    />
  </svg>
);

export default ViewIcon;
