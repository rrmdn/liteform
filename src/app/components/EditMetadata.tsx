import { Button, Form, Input, Popover } from "antd";
import { Controller, useForm } from "react-hook-form";
import { FormContext, LiteformForm } from "./LiteformContext";
import React from "react";

export default function EditMetadata() {
  const formValues = FormContext.useSelectState((state) => state.form);
  const form = useForm<Pick<LiteformForm, "name" | "description">>({
    defaultValues: {
      name: formValues.name,
      description: formValues.description,
    },
  });
  const formActions = FormContext.useActions();
  const [state, setState] = React.useState({
    isOpen: false,
  });
  return (
    <Popover
      open={state.isOpen}
      trigger="click"
      onOpenChange={(isOpen) => {
        setState({
          ...state,
          isOpen,
        });
      }}
      content={
        <Form
          layout="vertical"
          onSubmitCapture={form.handleSubmit((val) => {
            formActions.setMetadata(val);
            setState({
              ...state,
              isOpen: false,
            });
          })}
        >
          <Form.Item label="Title">
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input size="small" placeholder="Enter title" {...field} />
              )}
            />
          </Form.Item>
          <Form.Item label="Description">
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Input.TextArea
                  size="small"
                  placeholder="Enter description"
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button size="small" type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button size="small">Edit</Button>
    </Popover>
  );
}
