import jwt, { type JwtPayload } from "jsonwebtoken";

export const getConsumerFromJWT = (token: string) => {
  const decodedToken = jwt.decode(token);
  let consumer;

  if (decodedToken && typeof decodedToken !== "string") {
    consumer = (decodedToken as JwtPayload).consumer;
  } else {
    console.error("Failed to decode token or token is invalid.");
  }
  return consumer;
};
