import { draw } from "io-ts/lib/Tree";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";

import * as V from "./validators";
import * as ES from "./errors";
import { decodeQuery, rawQuery } from "./db";

/**
 * User Queries
 */
export const getUserById = (id: string) =>
  decodeQuery(`SELECT * FROM user WHERE id = ${id}`, V.UserWithId);

export const getUsers = () =>
  decodeQuery("SELECT * FROM user", V.UsersWithIds, true);

export const createUser = ({ name, password }: V.User) =>
  decodeQuery(
    `INSERT INTO user (${name}, ${password}) VALUES ($1, $2) RETURNING *`,
    V.UserWithId
  );

export const deleteUser = (id: string) =>
  decodeQuery(`DELETE FROM user WHERE id = ${id}`, V.NullableString);

/**
 * Ballot Queries
 */
export const getBallotById = (id: string) =>
  decodeQuery(`SELECT * FROM ballot WHERE id = ${id}`, V.BallotWithId);

export const getBallots = () =>
  decodeQuery("SELECT * FROM ballot", V.BallotsWithIds, true);

export const createBallot = (
  ballot: V.Ballot
): TE.TaskEither<ES.Failure, V.BallotWithId> => {
  const candidates = ballot.candidates
    .map((c) => `('${c.candidate_name}')`)
    .join(", ");
  return pipe(
    rawQuery(
      `WITH b AS (
        INSERT INTO ballot(ballot_title) VALUES ('${ballot.ballot_title}') RETURNING *
      ),
      cs AS (
        INSERT INTO candidate(candidate_name) VALUES ${candidates} RETURNING *
      ),
      bcs AS (
        INSERT INTO ballot_candidate(ballot_id, candidate_id)
        SELECT ballot_id, candidate_id FROM b, cs
        RETURNING *
      )
      SELECT b.ballot_id, cs.candidate_id, ballot_title, candidate_name
      FROM b, cs, bcs
      WHERE b.ballot_id = bcs.ballot_id
      AND cs.candidate_id = bcs.candidate_id;`
    ),
    TE.map((results) => {
      const ballot = results.rows.reduce(
        (ballot, cur) => ({
          ballot_id: cur.ballot_id,
          ballot_title: cur.ballot_title,
          candidates: ballot.candidates.concat({
            ballot_id: cur.ballot_id,
            candidate_id: cur.candidate_id,
            candidate_name: cur.candidate_name,
          }),
        }),
        { candidates: [] } as any
      );
      console.log("Mapping results", { results, ballot });
      return ballot;
    }),
    TE.chain((ballot) =>
      pipe(
        TE.fromEither(V.BallotWithId.decode(ballot)),
        TE.mapLeft((errors) => ES.badInternalData(draw(errors)))
      )
    )
  );
};

export const deleteBallot = (id: string) =>
  decodeQuery(`DELETE FROM ballot WHERE id = ${id}`, V.NullableString);
