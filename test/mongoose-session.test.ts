import {
  SerializedSession,
  sessionDeserializer,
  sessionSerializer,
} from '../src/mongoose-session';
import { ClientSession, Connection, createConnection } from 'mongoose';

const MONGO_CONFIG = () => {
  const host = process.env.MONGO_HOST;

  const username = process.env.MONGO_USER || null;
  const password = process.env.MONGO_PASS || null;
  const database = process.env.MONGO_DB || 'develop';

  const query = process.env.MONGO_QUERY || 'authSource=admin';

  return `mongodb://${username}:${password}@${host}/${database}?${query}`;
};

describe('test mongodb session serializer', () => {
  let client: Connection;
  let session: ClientSession;
  let serializedSession: SerializedSession;

  it('should create client', async () => {
    client = createConnection(MONGO_CONFIG());

    expect(client).toBeDefined();
  });

  it('should create session id', async () => {
    session = await client.startSession();

    expect(session?.id).toBeDefined();
  });

  it('should serialize a session', async () => {
    serializedSession = sessionSerializer(session);

    expect(serializedSession).toBeDefined();

    expect(sessionSerializer({} as ClientSession)).toStrictEqual({ id: '', type: -1 });
  });

  it('should deserialized a serialized session', async () => {
    session = sessionDeserializer(client, serializedSession);

    expect(session).toBeDefined();
  });
});
