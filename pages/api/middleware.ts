import { NextApiRequest, NextApiResponse } from 'next';

// Exporting Next.js API types for better type inference in your code
export type { NextApiRequest, NextApiResponse } from 'next';

// Define the type for the middleware function
type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (result: any) => void
) => void;

// A utility function for running middlewares in Next.js API routes
export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
) => {
  return new Promise((resolve, reject) => {
    // Execute the provided middleware function (fn) with the request, response, and a callback
    fn(req, res, (result) => {
      // If the result is an instance of Error, reject the promise with the error
      if (result instanceof Error) {
        return reject(result);
      }

      // If the result is not an error, resolve the promise with the result
      return resolve(result);
    });
  });
};
