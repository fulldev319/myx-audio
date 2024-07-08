import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

type WrapperProps = React.PropsWithChildren<{
  isMusic: boolean;
  isArt: boolean;
  isZoo: boolean;
}>;

const Wrapper = styled.div<WrapperProps>`
  background: ${(p) => `${!p.isZoo && p.isArt ? '#9eacf2' : 'inherit'}`};
  padding: ${(p) => `${!p.isZoo && p.isArt ? '20px 36px' : '0'}`};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: ${(p) =>
    `${
      p.isZoo
        ? '120px'
        : !p.isZoo && p.isMusic
        ? '35px'
        : !p.isZoo && p.isArt
        ? '0px'
        : '48px'
    }`};
  cursor: pointer;
  @media (max-width: 768px) {
    border-bottom: none;
    img {
      height: 40px;
    }
  }
  /*@media only screen and (max-width: 600px) {
    margin-right: 0px;
    img:first-child {
      width: 70px;
    }
  }*/
  > div > img {
    margin-left: 15px;
    width: 10px !important;
  }
`;

export default function MusicAppIcon(props) {
  const history = useHistory();

  return (
    <Wrapper isMusic={false} isArt={false} isZoo={false}>
      <img
        onClick={() => history.push('/')}
        src={require('assets/logos/music_logo.webp')}
        width="auto"
        height="61%"
        alt="Myx"
      />
    </Wrapper>
  );
}
