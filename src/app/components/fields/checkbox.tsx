import { Checkbox, Form, Input, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder.from({ value: false, options: {} }).build(
  () => ({
    OptionsEditor: (props) => {
      return null;
    },
    ValueEditor: (props) => {
      return (
        <Controller
          control={props.form.control}
          name={props.node.name}
          render={({ field }) => (
            <Checkbox onChange={field.onChange} checked={field.value} />
          )}
        />
      );
    },
    ValueRenderer: (props) => {
      console.log(props.node.value);
      return <span {...props.attributes}>{props.node.value === true ? "🗹" : "☐"}</span>;
    },
  }),
  {
    name: "Checkbox",
    type: "checkbox",
  }
);
