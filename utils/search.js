import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export const indexDocument = async (index, id, body) => {
  return await client.index({
    index,
    id,
    body,
  });
};

export const searchDocuments = async (index, body) => {
  return await client.search({
    index,
    body,
  });
};
