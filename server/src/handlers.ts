import * as H from "hyper-ts";
import { pipe } from "fp-ts/lib/pipeable";

import * as ES from "./errors";
import * as QS from "./queries";
import * as VS from "./validators";
import { bodyDecoder } from "./body_decoder";

const sendJSON = <D>(
  d: D
): H.Middleware<H.StatusOpen, H.ResponseEnded, ES.Failure, void> =>
  pipe(
    H.status(H.Status.OK),
    H.ichain(() => H.json(d, ES.jsonError))
  );

export const postBallotHandler = pipe(
  bodyDecoder(VS.Ballot),
  H.mapLeft(ES.badArgs),
  H.ichain((ballot) => H.fromTaskEither(QS.createBallot(ballot))),
  H.ichain(sendJSON),
  H.orElse(ES.sendError)
);
