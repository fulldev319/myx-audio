import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { processImage } from 'shared/helpers';

export default function FriendLabel({ friend, isLoading = false }) {
  const history = useHistory();

  const userSlug = React.useMemo(() => {
    const slug = friend?.urlSlug;
    return slug?.length > 15
      ? slug.substr(0, 11) + '...' + slug.substr(slug.length - 3, 3)
      : slug ?? '';
  }, [friend]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      style={{ cursor: 'pointer' }}
      onClick={() => history.push(`/profile/${friend.urlSlug}`)}
    >
      <Box display="flex" alignItems="flex-start" width="95%">
        <SkeletonBox
          loading={isLoading}
          image={processImage(friend.imageUrl) ?? getDefaultAvatar()}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            width: 32,
            height: 32,
            borderRadius: 16
          }}
        />
        <Box ml="14px" maxWidth="70%">
          <Box color="#181818" fontSize="16px" fontWeight={700} mb="4px">
            {friend.userName ?? (
              <SkeletonBox
                loading
                width={120}
                height={32}
                style={{ borderRadius: 16 }}
              />
            )}
          </Box>
          {isLoading ? (
            <SkeletonBox
              loading
              width={60}
              height={16}
              style={{ borderRadius: 16 }}
            />
          ) : (
            <Box fontSize="14px" fontWeight={700} color="#65CB63">
              @{userSlug}
            </Box>
          )}
        </Box>
      </Box>
      {friend.connected && (
        <Box
          style={{
            background: '#65CB63',
            width: '8px',
            height: '8px',
            borderRadius: '4px'
          }}
        />
      )}
    </Box>
  );
}
