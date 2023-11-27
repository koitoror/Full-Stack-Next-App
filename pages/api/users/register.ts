import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  AuthError,
  User,
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { StatusCode } from '../statusCodes';
import { runMiddleware } from '../middleware';

export type RegisterResult = {
  user?: User;
  error?: AuthError;
  status: StatusCode;
};

const register = async (email: string, password: string): Promise<RegisterResult> => {
  try {
    const auth = getAuth();
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return { user: response.user, status: StatusCode.OK };
  } catch (_error) {
    // Check the structure of the error object
    if ('code' in _error && typeof _error.code === 'string') {
      const error: AuthError = _error;
      let status = StatusCode.BAD_REQUEST;

      if (error.code === 'auth/email-already-in-use') {
        status = StatusCode.CONFLICT;
      }

      return { error, status };
    } else {
      // If it doesn't match the expected structure, handle it or rethrow
      throw _error;
    }
  }
};



const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RegisterResult>
) => {
  const cors = Cors({
    methods: ['POST', 'OPTIONS'],
  });
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const email = req.body.email;
    const password = req.body.password;
    const result = await register(email, password);
    res.status(result.status).json(result);
  }
};

export default handler;
