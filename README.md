# MongoDB Session Serializer/Deserializer

[![npm](https://img.shields.io/npm/v/mongodb-session-serializer)](https://www.npmjs.com/package/mongodb-session-serializer)
![npm](https://img.shields.io/npm/dm/mongodb-session-serializer)
[![Coverage](https://raw.githubusercontent.com/vhidvz/mongodb-session-serializer/main/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/mongodb-session-serializer/blob/main/docs/coverage/lcov-report/index.html)
[![GitHub](https://img.shields.io/github/license/vhidvz/mongodb-session-serializer?style=flat)](https://github.com/vhidvz/mongodb-session-serializer/blob/main/LICENSE)
[![documentation](https://img.shields.io/badge/documentation-click_to_read-c27cf4)](https://vhidvz.github.io/mongodb-session-serializer/)
[![Build, Test and Publish](https://github.com/vhidvz/mongodb-session-serializer/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/mongodb-session-serializer/actions/workflows/npm-ci.yml)

This package helps you serialize a MongoDB session and use it in a microservices environment on the same MongoDB infrastructure to have ACID at the database level.

- Support for multi-database transactions on the same MongoDB infrastructure

## Quick Start Guide

| # | Driver                 | MongoDB |      |
| - | ---------------------- | ------- | ---- |
| 1 | 5.x ( `mongoose` 7.x ) | 6.x     | OK   |
| 2 | 6.x ( `mongoose` 8.x ) | 7.x     | OK   |

### Installation

```sh
npm install --save mongodb mongodb-session-serializer
```

### Serializing

```ts
import { MongoClient, ReadPreference, TransactionOptions } from 'mongodb';
import { sessionSerializer } from 'mongodb-session-serializer';

export const transactionOptions: TransactionOptions = {
  readPreference: ReadPreference.primary,
  readConcern: { level: 'snapshot' },
  writeConcern: { w: 'majority' },

  maxCommitTimeMS: 15 * 60 * 1000, // 15 mins
};

// Connection URL - https://github.com/vhidvz/mongo-rs
const url =
  'mongodb://root:password123@mongodb-primary:27017,mongodb-secondary-1:27018,mongodb-secondary-2:27019,mongodb-arbiter:27020/?replicaSet=rs0';
const client = new MongoClient(url);

await client.connect();

const session = await client.startSession();

try {
  session.startTransaction(transactionOptions);

  // do anything you want...

  const serializedSession = sessionSerializer(session);
  // send the serialized session to another microservice
} catch {
  await session.abortTransaction();
}
```

### Deserializing

```ts
import { MongoClient, ReadPreference, TransactionOptions } from 'mongodb';
import { sessionDeserializer } from 'mongodb-session-serializer';

export const transactionOptions: TransactionOptions = {
  readPreference: ReadPreference.primary,
  readConcern: { level: 'snapshot' },
  writeConcern: { w: 'majority' },

  maxCommitTimeMS: 15 * 60 * 1000, // 15 mins
};

// Connection URL - https://github.com/vhidvz/mongo-rs
const url =
  'mongodb://root:password123@mongodb-primary:27017,mongodb-secondary-1:27018,mongodb-secondary-2:27019,mongodb-arbiter:27020/?replicaSet=rs0';
const client = new MongoClient(url);

await client.connect();

const session = sessionDeserializer(client, /* serialized session */);

try {
  session.startTransaction(transactionOptions);

  // do anything you want...

  await session.commitTransaction();
} catch {
  await session.abortTransaction();
} finally {
  await session.endSession();
}
```

## License

[MIT](https://github.com/vhidvz/mongodb-session-serializer/blob/main/LICENSE)
