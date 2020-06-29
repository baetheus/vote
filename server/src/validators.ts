import * as t from "io-ts/lib/Codec";

/**
 * User
 */
export const User = t.type({
  name: t.string,
  password: t.string,
});
export type User = t.TypeOf<typeof User>;

export const UserWithId = t.intersection(User, t.type({ user_id: t.number }));
export type UserWithId = t.TypeOf<typeof UserWithId>;

export const UsersWithIds = t.array(UserWithId);
export type UsersWithIds = t.TypeOf<typeof UsersWithIds>;

/**
 * Candidate
 */
export const Candidate = t.type({
  candidate_name: t.string,
});
export type Candidate = t.TypeOf<typeof Candidate>;

export const CandidateWithId = t.intersection(
  Candidate,
  t.type({ candidate_id: t.number })
);
export type CandidateWithId = t.TypeOf<typeof Candidate>;

export const CandidatesWithIds = t.array(CandidateWithId);
export type CandidatesWithIds = t.TypeOf<typeof CandidatesWithIds>;

/**
 * Ballot
 */
export const Ballot = t.type({
  ballot_title: t.string,
  candidates: t.array(Candidate),
});
export type Ballot = t.TypeOf<typeof Ballot>;

export const BallotWithId = t.intersection(
  Ballot,
  t.type({ ballot_id: t.number })
);
export type BallotWithId = t.TypeOf<typeof BallotWithId>;

export const BallotsWithIds = t.array(BallotWithId);
export type BallotsWithIds = t.TypeOf<typeof BallotsWithIds>;

/**
 * Nullable String
 */
export const NullableString = t.nullable(t.string);
