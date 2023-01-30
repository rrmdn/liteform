import { DatePicker, Form, Input, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Controller } from "react-hook-form";
import builder from "./builder";

export default builder
  .from({
    value: dayjs().toDate(),
    options: { before: dayjs().subtract(3, "days").toDate() },
  })
  .build(
    () => ({
      OptionsEditor: (props) => {
        return (
          <Form.Item label="Max character">
            <Controller
              control={props.form.control}
              name="options.before"
              render={({ field }) => (
                <DatePicker
                  size="small"
                  placeholder={field.name}
                  onChange={(date) => field.onChange(date?.toDate())}
                  value={dayjs(field.value)}
                  onBlur={field.onBlur}
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
            rules={{
              validate: (value) => {
                return value && value >= props.node.options.before;
              },
            }}
            render={({ field }) => (
              <DatePicker
                size="small"
                placeholder={`Enter ${props.node.name}`}
                onChange={(date) => field.onChange(date?.toDate())}
                value={dayjs(field.value)}
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
            ? parsed.toDate().toLocaleDateString()
            : `[empty date]`;
        }, [props.node?.value]);
        return <Typography.Text>{date}</Typography.Text>;
      },
    }),
    {
      name: "Date",
      type: "date",
    }
  );
