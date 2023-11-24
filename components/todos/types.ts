export type Todo = {
  id?: string;
  text: string;
  completed: boolean;
};

// types.ts
export type AsyncThunkArgAddTodo = {
  text: string;
  callbackSuccess: () => void;
  callbackFail: (errorMessage: string) => void;
};

