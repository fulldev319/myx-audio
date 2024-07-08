import { gql } from 'graphql-request';

export const COPYRIGHT_TOKEN_POSITIONS_QUERY = gql`
  {
    copyrightTokenPositions(first: 5) {
      id
      user {
        id
      }
      balance
    }
  }
`;
