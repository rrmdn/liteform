import { Skeleton } from "antd";
import React from "react";
import {
  FormContext,
  LiteformForm,
  LiteformMode,
} from "../app/components/LiteformContext";
import { LiteformRichText } from "../app/components/LiteformEditor";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

function FormLoader() {
  const mode = FormContext.useSelectState((state) => state.mode);
  const formActions = FormContext.useActions();

  React.useEffect(() => {
    window.addEventListener("message", (e) => {
      const { data } = e;
      const action = data.action;
      if (action !== "LOAD_FORM_RESPONSE") return;
      const form = data.form as LiteformForm;
      const values = data.values as Record<string, any>;
      const responded_at = dayjs(data.responded_at).toDate();

      formActions.setForm(form);
      formActions.setResponse({
        id: nanoid(13),
        respondent: {
          name: "",
          email: "",
          id: "",
        },
        responses: values,
        responded_at,
      });
      formActions.setMode(LiteformMode.RESPONSE);
      setTimeout(() => {
        window.print();
      }, 5000);
    });
  }, []);
  if (mode === "EDIT") return <Skeleton />;
  return <LiteformRichText width={640} />;
}

export default function Print() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px 0",
      }}
    >
      <FormContext.Provider>
        <FormLoader />
      </FormContext.Provider>
    </div>
  );
}
