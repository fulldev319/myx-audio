import * as React from 'react';

const PlayIcon = (props) => (
  <svg
    width={11}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.5 5.134a1 1 0 0 1 0 1.732l-8.25 4.763a1 1 0 0 1-1.5-.866V1.237A1 1 0 0 1 2.25.37l8.25 4.763Z"
      fill={props.fill || '#2D3047'}
    />
  </svg>
);

export default PlayIcon;
