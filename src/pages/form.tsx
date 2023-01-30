import LiteForm from "../app/components/LiteForm";
import { FormContext } from "../app/components/LiteformContext";

export default function Form() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px 0",
      }}
    >
      <FormContext.Provider>
        <LiteForm />
      </FormContext.Provider>
    </div>
  );
}
