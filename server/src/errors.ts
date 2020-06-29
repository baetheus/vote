import * as H from "hyper-ts";
import { pipe } from "fp-ts/lib/pipeable";

import { notNil } from "./utilities";

/**
 * Errors
 */
export enum Errors {
  EntityNotFound = "EntityNotFound",
  InvalidArguments = "InvalidArguments",
  InvalidInternalData = "InvalidInternalData",
  InvalidMethod = "InvalidMethod",
  DatastoreFailure = "DatastoreFailure",
  JSONError = "JSONError",
}

export type Failure = {
  type: Errors;
  /**
   * Data must be serializable and customer accessible.
   **/
  data?: any;
};

export const notFound = (data?: any): Failure => ({
  type: Errors.EntityNotFound,
  data,
});
export const badArgs = (data?: any): Failure => ({
  type: Errors.InvalidArguments,
  data,
});
export const badInternalData = (data?: any): Failure => ({
  type: Errors.InvalidInternalData,
  data,
});
export const badMethod = (data?: any): Failure => ({
  type: Errors.InvalidMethod,
  data,
});
export const datastoreFail = (data?: any): Failure => ({
  type: Errors.DatastoreFailure,
  data,
});
export const jsonError = (data?: any): Failure => ({
  type: Errors.JSONError,
  data,
});

const send = (status: H.Status, message: string, details?: any) => {
  const body = notNil(details)
    ? { status, message, details }
    : { status, message };
  return pipe(
    H.status(status),
    H.ichain(() => H.header("x-status-message", message)),
    H.ichain(() => H.json(body, () => "Error encoding body response."))
  );
};

export const sendError = (failure: Failure) => {
  switch (failure.type) {
    case Errors.InvalidArguments:
      return send(
        H.Status.BadRequest,
        "The supplied arguments are invalid.",
        failure.data
      );
    case Errors.InvalidMethod:
      return send(H.Status.BadRequest, "Invalid method for this request.");
    case Errors.JSONError:
      return send(
        H.Status.BadRequest,
        "An error occurred while parsing user supplied JSON.",
        failure.data
      );

    case Errors.EntityNotFound:
      return send(H.Status.NotFound, "The specified entity does not exist.");

    case Errors.DatastoreFailure:
      return send(
        H.Status.InternalServerError,
        "An error occurred while accessing the datastore.",
        failure.data
      );
    case Errors.InvalidInternalData:
      return send(
        H.Status.InternalServerError,
        "Internal data is invalid.",
        failure.data
      );
    default:
      return send(
        H.Status.InternalServerError,
        "An unknown error occurred.",
        failure.data
      );
  }
};
