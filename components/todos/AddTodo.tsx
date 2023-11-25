// AddTodo.tsx
import React from 'react';
import styles from '../../styles/AddTodo.module.less';
import { Form, Input, Button, Spin, message } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../../store/slices/todoSlice';
import { RootState } from '../../store';
import { AsyncThunkArgAddTodo } from './types';
import { unwrapResult } from '@reduxjs/toolkit';


type FinishHandler = (values: {
  text: string;
}) => void;

const AddTodo: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.todos.isLoading);

  const onFinish: FinishHandler = async ({ text }) => {
    let callbackFail: (message: string) => void;
    callbackFail = (errorMessage) => message.error(errorMessage);
    const arg: AsyncThunkArgAddTodo = {
      text,
      callbackSuccess: () => message.info('Task was successfully added!'),
      callbackFail: (error) => {
        console.error('Error adding todo:', error);
      },
    };
  
    try {
      // const resultAction = await dispatch(addTodo(arg));
      
      // // Check if the fulfilled action was dispatched
      // if (addTodo.fulfilled.match(resultAction)) {
      //   form.resetFields();
      // } else {
      //   // Handle other cases if needed
      // }
      const resultAction = await dispatch(addTodo(arg));
      const result = unwrapResult(resultAction);
      // Assuming addTodo fulfills with the todo object, you can access it in 'result'
      if (result) {
        // Handle successful fulfillment
        form.resetFields();
      } else {
        // Handle other states (rejected, pending, etc.) if needed
      }
      // form.resetFields();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  

  const onFinishFailed = (e: ValidateErrorEntity) => {
    message.error(e.errorFields[0].errors[0]);
  };

  const onReset = () => form.resetFields();

  if (isLoading) {
    return <Spin size="large" className={styles.spin} />;
  } else {
    return (
      <Form
        className={styles.form}
        form={form}
        name="add-todo"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Text"
          name="text"
          rules={[
            {
              required: true,
              message: 'Please input your task!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ sm: { offset: 6, span: 18 } }}>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            Submit
          </Button>
          <Button onClick={onReset} className={styles.reset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default AddTodo;
