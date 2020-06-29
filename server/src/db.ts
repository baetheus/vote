import { Client, QueryResult } from "pg";
import { Decoder } from "io-ts/lib/Decoder";
import { draw } from "io-ts/lib/Tree";
import * as TE from "fp-ts/lib/TaskEither";
import { right, left } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import * as E from "./errors";

const DATABASE_URL = process.env.DATABASE_URL;

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: false,
});

client
  .connect()
  .catch((reason) =>
    console.error("Failed to connect to database.", { DATABASE_URL, reason })
  );

/**
 * Wrap a raw pg query in a TaskEither, map failures to predefined
 * Failure type.
 */
export const rawQuery = (text: string): TE.TaskEither<E.Failure, QueryResult> =>
  pipe(() =>
    client
      .query(text)
      .then(right)
      .catch((err) => left(E.datastoreFail(err)))
  );

/**
 * Query datastore and decode results, mapping errors to predefined Failure
 * type.
 */
export const decodeQuery = <T>(
  query: string,
  { decode }: Decoder<T>,
  multiple: boolean = false
): TE.TaskEither<E.Failure, T> =>
  pipe(
    rawQuery(query),
    // Wrap queries with no results in notFound failures
    TE.chain(
      TE.fromPredicate(
        (result) => result.rowCount > 0,
        (err) => E.notFound(err)
      )
    ),
    // Wrap decode errors in badInternalData failures
    TE.chain(({ rows }) =>
      pipe(
        TE.fromEither(decode(multiple ? rows : rows[0])),
        TE.mapLeft((errors) => E.badInternalData(draw(errors)))
      )
    )
  );
