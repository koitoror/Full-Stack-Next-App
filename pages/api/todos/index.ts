import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  collection,
  getDocs,
  addDoc,
  FirestoreError
} from 'firebase/firestore/lite';
import { db } from '../../../firebase';
import type { Todo } from '../../../components/todos/types';
import { StatusCode } from '../statusCodes';
import { runMiddleware } from '../middleware';
import type { DocumentData, CollectionReference, Firestore, DocumentReference, FirestoreErrorCode } from 'firebase/firestore/lite';


export type GetTodosResult = {
  todos?: Todo[];
  error?: FirestoreError;
  status: StatusCode;
};

export type AddTodoResult = {
  todo?: Todo;
  error?: FirestoreError;
  status: StatusCode;
}

type Response = GetTodosResult | AddTodoResult;

const collectionName = process.env.FIREBASE_TODOS_COLLECTION;

const getTodos = async (): Promise<GetTodosResult> => {
  try {
    if (!collectionName) {
      throw new Error('Collection name is not defined');
    }

    const querySnapshot = await getDocs(collection(db, collectionName));
    const todos: Todo[] = [];

    querySnapshot.forEach(doc => {
      const todoData = doc.data() as Todo;
      const todo: Todo = { id: doc.id, ...todoData };
      todos.push(todo);
    });

    return { todos, status: StatusCode.OK };
  } catch (error: any) {
    const firestoreError: FirestoreError = error;
    const status = StatusCode.BAD_REQUEST;
    return { error: firestoreError, status };
  }
};


const addTodo = async (todo: Todo): Promise<AddTodoResult> => {
  try {
    // const docRef = await addDoc(collection(db, collectionName), todo);
    // const docRef = await addDoc(collection(db as Firestore, collectionName) as CollectionReference<DocumentData, DocumentData>, todo);
    const docRef = await addDoc(collection(db as Firestore, collectionName), todo);


    const modifyTodo = { id: docRef.id, ...todo };
    return { todo: modifyTodo, status: StatusCode.CREATED };
  } catch (_error) {
    const error: FirestoreError = _error;
    let status = StatusCode.BAD_REQUEST;
    if (error.code === 'permission-denied') {
      status = StatusCode.UNAUTHORIZED;
    }
    return { error, status };
  }
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response>
) => {
  const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  });
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    const result = await getTodos();
    res.status(result.status).json(result);
  }

  if (req.method === 'POST') {
    const newTodo: Todo = {
      completed: !!req.body.completed,
      text: req.body.text as string
    };
    const result = await addTodo(newTodo);
    res.status(result.status).json(result);
  }
};

export default handler;
