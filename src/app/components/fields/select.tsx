import { Form, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder
  .from({ options: { options: ["Yes", "No"] }, value: "Yes" })
  .build(
    () => ({
      OptionsEditor: (props) => {
        return (
          <>
            <Form.Item label="Options">
              <Controller
                control={props.form.control}
                name="options.options"
                render={({ field }) => (
                  <Select
                    mode="tags"
                    style={{ width: "200px" }}
                    placeholder={`Select ${props.node.name}`}
                    onChange={field.onChange}
                    value={field.value.map((option) => ({ value: option }))}
                    onBlur={field.onBlur}
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
            render={({ field }) => {
              return (
                <Select
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  defaultValue={props.node.default}
                  placeholder={`Select ${props.node.name}`}
                  options={props.node.options.options.map((option) => ({
                    value: option,
                  }))}
                />
              );
            }}
          />
        );
      },
      ValueRenderer: (props) => {
        return (
          <span {...props.attributes}>
            {props.node.options.options
              .map((option) => (
                <span
                  style={{
                    textDecoration:
                      option === props.node.value
                        ? "underline"
                        : "line-through",
                  }}
                >
                  {option}
                </span>
              ))
              .reduce(
                (prev, curr) =>
                  prev.length > 0 ? [...prev, <span> / </span>, curr] : [curr],
                [] as JSX.Element[]
              )}
          </span>
        );
      },
    }),
    {
      name: "Select",
      type: "select",
    }
  );
