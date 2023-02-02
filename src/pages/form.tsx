import React from "react";
import LiteForm from "../app/components/LiteForm";
import { FormContext, LiteformMode } from "../app/components/LiteformContext";

const LiteFormWrapper = () => {
  const formActions = FormContext.useActions();
  React.useEffect(() => {
    formActions.setMode(LiteformMode.RESPONSE);
  }, []);
  return <LiteForm />;
};

export default function Form() {
  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
      }}
    >
      <div style={{ height: 52 }}></div>
      <FormContext.Provider>
        <LiteFormWrapper />
      </FormContext.Provider>
    </div>
  );
}
