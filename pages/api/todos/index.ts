import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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

const collectionName = process.env.NEXT_PUBLIC_FIREBASE_TODOS_COLLECTION;
console.log('collectionName  → ', collectionName)
console.log('#####################');

const getTodos = async (): Promise<GetTodosResult> => {
  try {
    console.log('collectionName  getTodos → ', collectionName)
    console.log('********************');
    
    if (!collectionName) {
      throw new Error('Collection name is not defined');
    }

    const todoRef = collection(db, 'todos')
    // console.log('todoRef → ', todoRef);
    
    const querySnapshot = await getDocs(todoRef)
    // console.log('querySnapshot → ', querySnapshot);


    // const querySnapshot = await getDocs(collection(db, "todos"));


    const todos: Todo[] = [];
    console.log('querySnapshot → ', querySnapshot);
    
    querySnapshot.forEach(doc => {
      const todoData = doc.data() as Todo;
      const todo: Todo = { id: doc.id, ...todoData };
      todos.push(todo);
    });
    console.log('todos → ', todos);
    
    return { todos, status: StatusCode.OK };
  } catch (_error) {
    if (_error instanceof FirestoreError) {
      const error: FirestoreError = _error;
      let status = StatusCode.BAD_REQUEST;
      console.log('error → ', error);
      console.log('status → ', status);

      if (error.code === 'permission-denied') {
        status = StatusCode.UNAUTHORIZED;
      }

      return { error, status };
    } else {
      // If it's not a FirestoreError, handle it or rethrow
      throw _error;
    }
  }
  // catch (error: any) {
  //   const firestoreError: FirestoreError = error;
  //   const status = StatusCode.BAD_REQUEST;
  //   return { error: firestoreError, status };
  // }
};


const addTodo = async (todo: Todo): Promise<AddTodoResult> => {
  try {
    console.log('collectionName  addTodo → ', collectionName)
    if (!collectionName) {
      throw new Error('Collection name is not defined');
    }
    
    const docRef = await addDoc(collection(db, collectionName), todo);
    console.log('docRef → ', docRef);

    const modifyTodo = { id: docRef.id, ...todo };

    return { todo: modifyTodo, status: StatusCode.CREATED };
  } catch (_error) {
    if (_error instanceof FirestoreError) {
      const error: FirestoreError = _error;
      let status = StatusCode.BAD_REQUEST;

      if (error.code === 'permission-denied') {
        status = StatusCode.UNAUTHORIZED;
      }

      return { error, status };
    } else {
      // If it's not a FirestoreError, handle it or rethrow
      throw _error;
    }
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
    console.log('result  → ', result)
    
    res.status(result.status).json(result);
  }
  
  if (req.method === 'POST') {
    const newTodo: Todo = {
      completed: !!req.body.completed,
      text: req.body.text as string
    };
    const result = await addTodo(newTodo);
    console.log('newTodo → result  → ', result)
    res.status(result.status).json(result);
  }
};

export default handler;
