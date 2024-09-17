import { function as func, option, reader } from "fp-ts";
import fastify, { FastifyRequest } from "fastify";

const app = fastify();

type Cache = Map<string, number>;

const memoize = <T extends (...args: any[]) => any>(
  fn: T,
): reader.Reader<Cache, T> => {
  return (cache) => {
    const memoizedFn = function (...args: Parameters<T>): ReturnType<T> {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key) as ReturnType<T>;
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
    return memoizedFn as T;
  };
};

const cache: Cache = new Map();

const fibonacci = memoize((n: number): number =>
  n <= 1 ? n : fibonacci(cache)(n - 1) + fibonacci(cache)(n - 2)
);

const fn = func.flow(
  (x: string | undefined) => option.fromNullable(x),
  option.map((x) => parseInt(x, 10)),
  option.match(
    () => 0,
    (x) => Math.min(100, x),
  ),
);

app.get("/", async (
  request: FastifyRequest<{
    Querystring: { n?: string };
  }>,
  _reply,
) => {
  const n = fn(request.query.n);
  return { n, result: fibonacci(cache)(n) };
});

await app.listen({ port: 3000 });
