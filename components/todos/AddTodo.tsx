import React from 'react';
import styles from '../../styles/AddTodo.module.less';
import { Form, Input, Button, Spin, message } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../../store/slices/todoSlice';
import { RootState } from '../../store';

type FinishHandler = (values: { text: string }) => void;

const AddTodo: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.todos.isLoading);

  const onFinish: FinishHandler = async ({ text }) => {
    try {
      let callbackFail: (message: string) => void;
      callbackFail = (errorMessage) => message.error(errorMessage);
      const arg = {
        text,
        callbackSuccess: () => message.info('Task was successfully added!'),
        callbackFail,
      };
      // Dispatch the async thunk action creator
      await dispatch(addTodo(arg));
      form.resetFields();
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
        {/* ... rest of the component ... */}
      </Form>
    );
  }
};

export default AddTodo;
