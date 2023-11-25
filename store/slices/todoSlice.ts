// todoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define types and interfaces as needed
// For example, AsyncThunkArgAddTodo, Todo, AddTodoResult, RootState

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (
    arg: AsyncThunkArgAddTodo,
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const dataToSerialize: Pick<Todo, 'text'> = { text: arg.text };
      const response = await fetch(`${API_HOST}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSerialize),
      });
      const data: AddTodoResult = await response.json();
      if (data.todo) {
        arg.callbackSuccess();
        return data.todo;
      } else {
        const message = getErrorMessageByStatusCode(data.status);
        throw new Error(message);
      }
    } catch (error) {
      arg.callbackFail(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Define the initial state and the reducer using createSlice
const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Add other reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default todoSlice.reducer;

// Export actions as needed
// export const { someAction } = todoSlice.actions;
