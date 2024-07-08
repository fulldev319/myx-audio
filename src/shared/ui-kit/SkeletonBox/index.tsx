import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

interface SkeletonBoxProps extends BoxProps {
  loading: boolean;
  image?: string;
}

const SkeletonImageBox: React.FC<SkeletonBoxProps> = ({
  loading,
  image,
  children,
  ...props
}: SkeletonBoxProps) => {
  if (loading) {
    return (
      <Box {...props} overflow="hidden">
        <Skeleton
          animation="wave"
          variant="rect"
          width={'100%'}
          height={'100%'}
        />
      </Box>
    );
  } else {
    return (
      <Box
        {...props}
        style={{
          ...props.style,
          backgroundImage: image ? `url("${image}")` : undefined
        }}
      >
        {children}
      </Box>
    );
  }
};

export default SkeletonImageBox;
