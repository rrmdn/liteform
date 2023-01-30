import { DatePicker, Form, Input, Select, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder
  .from({
    value: dayjs().toDate(),
    options: { format: "DD/MM/YYYY" },
  })
  .build(
    () => ({
      OptionsEditor: (props) => {
        return (
          <Form.Item label="Date format">
            <Controller
              control={props.form.control}
              name="options.format"
              render={({ field }) => (
                <Select
                  placeholder={"Select date format"}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  options={[
                    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                    { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                  ]}
                />
              )}
            />
          </Form.Item>
        );
      },
      ValueEditor: (props) => {
        return (
          <Controller
            control={props.form.control}
            name={props.node.name}
            render={({ field }) => (
              <DatePicker
                size="small"
                placeholder={`Enter ${props.node.name}`}
                onChange={(date) => field.onChange(date?.toDate())}
                value={field.value ? dayjs(field.value) : undefined}
                onBlur={field.onBlur}
              />
            )}
          />
        );
      },
      ValueRenderer: (props) => {
        const date = React.useMemo(() => {
          const parsed = dayjs(props.node.value);
          return parsed.isValid()
            ? parsed.format(props.node.options.format)
            : `[empty date]`;
        }, [props.node?.value]);
        return <span {...props.attributes}>{date}</span>;
      },
    }),
    {
      name: "Date",
      type: "date",
    }
  );
