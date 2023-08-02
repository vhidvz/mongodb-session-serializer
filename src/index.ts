import {
  ServerSessionPool,
  ServerSession,
  ClientSession as SessionClient,
} from 'mongodb/lib/sessions';
import { Binary, ClientSession, ClientSessionOptions, MongoClient } from 'mongodb';

export type SerializedSession = { id: string; type: number };

export function sessionSerializer(session: ClientSession): SerializedSession {
  const { id } = session.id ?? {id: {toString: (x) => '', sub_type: -1}};
  return { id: id.toString('hex'), type: id.sub_type };
}

export function sessionDeserializer(
  client: MongoClient,
  session: SerializedSession,
  options?: ClientSessionOptions,
): ClientSession {
  const sessionPool = new ServerSessionPool(client);

  const { id, type } = session;
  const serverSession = new ServerSession();
  serverSession.id = { id: Binary.createFromHexString(id, type) };

  sessionPool.sessions.push(serverSession);

  return new SessionClient(client, sessionPool, options);
}
