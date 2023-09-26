import { sessionSerializer, sessionDeserializer, SerializedSession } from '../src';
import { ClientSession, MongoClient } from 'mongodb';

const MONGO_CONFIG = () => {
  const host = process.env.MONGO_HOST;

  const username = process.env.MONGO_USER || null;
  const password = process.env.MONGO_PASS || null;
  const database = process.env.MONGO_DB || 'develop';

  const query = process.env.MONGO_QUERY || 'authSource=admin';

  return `mongodb://${username}:${password}@${host}/${database}?${query}`;
};

describe('test mongodb session serializer', () => {
  let client: MongoClient;
  let session: ClientSession;
  let serializedSession: SerializedSession;

  it('should create client', async () => {
    client = new MongoClient(MONGO_CONFIG());

    expect(async () => await client.connect()).not.toThrow();
  });

  it('should serialize a session', async () => {
    serializedSession = sessionSerializer(await client.startSession());

    expect(serializedSession).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sessionSerializer({} as any)).toStrictEqual({ id: '', type: -1 });
  });

  it('should deserialized a serialized session', async () => {
    session = sessionDeserializer(client, serializedSession);
    expect(session).toBeDefined();
  });
});
