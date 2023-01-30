import { Form, Input, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder
  .from({ value: "", options: { max: 50, input: "textarea" } })
  .build(
    () => ({
      OptionsEditor: (props) => {
        return (
          <>
            <Form.Item label="Max character">
              <Controller
                control={props.form.control}
                name="options.max"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Form.Item>
            <Form.Item label="Column">
              <Controller
                control={props.form.control}
                name="options.input"
                render={({ field }) => (
                  <Select
                    placeholder={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    options={[
                      { label: "Text", value: "input" },
                      { label: "Textarea", value: "textarea" },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </>
        );
      },
      ValueEditor: (props) => {
        return (
          <Controller
            control={props.form.control}
            name={props.node.name}
            rules={{ maxLength: props.node.options.max }}
            render={({ field }) =>
              props.node.options.input === "textarea" ? (
                <Input.TextArea
                  size="small"
                  placeholder={`Enter ${props.node.name}`}
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                />
              ) : (
                <Input
                  size="small"
                  placeholder={`Enter ${props.node.name}`}
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                />
              )
            }
          />
        );
      },
      ValueRenderer: (props) => {
        return <Typography.Text>{props.node.value}</Typography.Text>;
      },
    }),
    {
      name: "Text",
      type: "text",
    }
  );
