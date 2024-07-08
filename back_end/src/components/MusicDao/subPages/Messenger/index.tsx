import React from 'react';
import styled from 'styled-components';
import { MessageBox } from 'components/MusicDao/components/Message/MessageBox';

const Messenger = () => {
  return (
    <Container>
      <MessageBox />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;

export default Messenger;
