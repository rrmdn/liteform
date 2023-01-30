import { Form, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder
  .from({ options: { options: ["Yes", "No"], default: "Yes" }, value: "Yes" })
  .build(
    () => ({
      OptionsEditor: (props) => {
        const options = props.form.watch("options.options");
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
            <Form.Item label="Default selected">
              <Controller
                control={props.form.control}
                name="options.default"
                render={({ field }) => (
                  <Select
                    style={{ width: "200px" }}
                    placeholder={`Select ${props.node.name}`}
                    onChange={field.onChange}
                    value={field.value}
                    options={options.map((option) => ({
                      value: option,
                    }))}
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
                  defaultValue={props.node.options.default}
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
          <>
            {props.node.options.options
              .map((option) => (
                <Typography.Text
                  style={{
                    textDecoration:
                      option === props.node.value
                        ? "underline"
                        : "line-through",
                  }}
                >
                  {option}
                </Typography.Text>
              ))
              .reduce(
                (prev, curr) =>
                  prev.length > 0
                    ? [...prev, <Typography.Text> / </Typography.Text>, curr]
                    : [curr],
                [] as JSX.Element[]
              )}
          </>
        );
      },
    }),
    {
      name: "Select",
      type: "select",
    }
  );
