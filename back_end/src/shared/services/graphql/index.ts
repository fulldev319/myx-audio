import { GraphQLClient } from 'graphql-request';

const CREATION_MANAGER_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/totoptech/creation-manager';

export const graphQLClient = new GraphQLClient(CREATION_MANAGER_ENDPOINT);
