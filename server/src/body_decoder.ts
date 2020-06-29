import { fromRequestHandler } from "hyper-ts/lib/express";
import { Decoder } from "io-ts/lib/Decoder";
import { draw } from "io-ts/lib/Tree";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as H from "hyper-ts";
import express from "express";

import * as ES from "./errors";

const json = express.json();

const jsonMiddleware = fromRequestHandler(json, () => undefined);

export const bodyDecoder = <A>({ decode }: Decoder<A>) =>
  pipe(
    jsonMiddleware,
    H.ichain(() =>
      H.decodeBody((body) =>
        pipe(
          decode(body),
          E.mapLeft((errors) => ES.badInternalData(draw(errors)))
        )
      )
    )
  );
