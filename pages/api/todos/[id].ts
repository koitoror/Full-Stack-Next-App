import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
// Import the necessary types from Firebase
import type { DocumentData, CollectionReference, DocumentReference, FirestoreErrorCode } from 'firebase/firestore/lite';

import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  FirestoreError
} from 'firebase/firestore/lite';
import { db } from '../../../firebase';
import type { Todo } from '../../../components/todos/types';
import { StatusCode } from '../statusCodes';
import { runMiddleware } from '../middleware';



export type UpdateTodoResult = {
  id?: string;
  updatedFields?: Partial<Todo>;
  error?: FirestoreError;
  status: StatusCode;
}

export type RemoveTodoResult = {
  id?: string;
  error?: FirestoreError;
  status: StatusCode;
};

type Response = UpdateTodoResult | RemoveTodoResult;

const collectionName: string = process.env.FIREBASE_TODOS_COLLECTION || '';

const updateTodo = async (id: string, fieldsToUpdate: Partial<Todo>): Promise<UpdateTodoResult> => {
  try {
    if (!id) {
      throw new Error('ID is missing');
    }

    // Ensure that `collectionName` is a string
    if (typeof collectionName !== 'string') {
      throw new Error('Invalid collectionName');
    }

    const docRef: DocumentReference<DocumentData> = doc(collection(db, collectionName), id);
    await updateDoc(docRef, fieldsToUpdate);
    return { id, updatedFields: fieldsToUpdate, status: StatusCode.OK };
  } catch (error) {
    let status = StatusCode.BAD_REQUEST;

    // if (error instanceof Error) {
    if (error instanceof CustomError) {

      const firestoreError = error as FirestoreError | undefined;

      if (firestoreError && firestoreError.code === 'permission-denied') {
        status = StatusCode.UNAUTHORIZED;
      }

      return { error: firestoreError, status };
    }
    // Handle other types of errors or unknown errors here
    // return { error: new Error('Unknown error'), status };
    return { error: new CustomError('Unknown error'), status };

  }
};

const removeTodo = async (id: string): Promise<RemoveTodoResult> => {
  try {
    if (!id) {
      // throw new Error('ID is missing');
      throw new CustomError('ID is missing', 'invalid-id');
    }

    const docRef = doc(collection(db, collectionName), id);
    await deleteDoc(docRef);
    return { id, status: StatusCode.OK };
  } catch (error) {
    let status = StatusCode.BAD_REQUEST;

    if (error instanceof CustomError) {
      const firestoreError: FirestoreError = error;

      if (firestoreError.code === 'permission-denied') {
        status = StatusCode.UNAUTHORIZED;
      }

      return { error: firestoreError, status };
    }

    // Handle other types of errors or unknown errors here
    return { error: new CustomError('Unknown error'), status };
  }
};


class CustomError extends Error {
  // Set a default value for code
  code: FirestoreErrorCode = 'unknown';

  constructor(message?: string, code?: FirestoreErrorCode) {
    super(message);
    if (code) {
      this.code = code;
    }

    // Set the prototype explicitly
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response>
) => {
  const cors = Cors({
    methods: ['PATCH', 'DELETE', 'OPTIONS'],
  });
  await runMiddleware(req, res, cors);

  if (req.method === 'PATCH') {
    const id = req.query.id as string | undefined;
    // Handle the case where id is undefined
    if (!id) {
      res.status(400).json({ error: 'Missing id parameter', status: StatusCode.BAD_REQUEST });
      return;
    }
    
    const fieldsToUpdate: Partial<Todo> = {
      completed: !!req.body.completed
    };
    const result = await updateTodo(id, fieldsToUpdate);
    res.status(result.status).json(result);
  }

  if (req.method === 'DELETE') {
    const id = req.query.id as string | undefined;
    if (!id) {
      res.status(400).json({ error: 'Missing id parameter', status: StatusCode.BAD_REQUEST });
      return;
    }
    const result = await removeTodo(id);
    res.status(result.status).json(result);
  }
}

export default handler;
