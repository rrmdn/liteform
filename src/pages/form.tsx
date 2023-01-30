import LiteForm from "../app/components/LiteForm";
import { FormContext } from "../app/components/LiteformContext";

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
        <LiteForm />
      </FormContext.Provider>
    </div>
  );
}
