import { nanoid } from "nanoid";
import { createContext } from "react-immersive";
import { Descendant } from "slate";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Type } from "@sinclair/typebox";

export type Identity = {
  id: string;
  email: string;
  name: string;
};

export type FormField<TOpts = any, TVal = any> = {
  id: string;
  type: string;
  name: string;
  default?: TVal;
  options: TOpts;
};

export type LiteformForm = {
  id: string;
  name: string;
  description: string;
  source: Descendant[];
  fields: Record<string, FormField>;
  owner: Identity;
};

export const LiteformCompiler = TypeCompiler.Compile(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
    source: Type.Array(Type.Any()),
    fields: Type.Record(Type.String(), Type.Any()),
    owner: Type.Object({
      email: Type.String(),
      name: Type.String(),
      id: Type.String(),
    }),
  })
);

export type LiteformResponse = {
  id: string;
  responses: any;
  respondent: Identity;
  responded_at: Date;
};

export const defaultForm: LiteformForm = {
  id: nanoid(6),
  name: "Sample form",
  description: "Simple form with a single text field",
  source: [
    { type: "heading-one", children: [{ text: "" }], align: "center" },
    {
      type: "heading-one",
      align: "center",
      children: [{ text: "Power of Attorney - Limited" }],
    },
    {
      type: "paragraph",
      children: [
        { text: "I, " },
        {
          field_id: "Wlx8iV",
          type: "field",
          children: [{ text: "[principal_name]" }],
        },
        { text: " of " },
        {
          field_id: "9Sv-Rd",
          type: "field",
          children: [{ text: "[principal_address]" }],
        },
        { text: ", the undersigned, hereby appoint and make " },
        {
          field_id: "hjnif9",
          type: "field",
          children: [{ text: "[agent_name]" }],
        },
        { text: " of " },
        {
          field_id: "5FDurB",
          type: "field",
          children: [{ text: "[agent_address]" }],
        },
        {
          text: " as my attorney-in-fact who shall have full power and authority to represent me and act on my behalf for ONLY the following matters:",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        { text: "" },
        {
          field_id: "Dpy12k",
          type: "field",
          children: [{ text: "[matters]" }],
        },
        { text: " " },
      ],
    },
    {
      type: "paragraph",
      children: [
        { text: "This Power of Attorney shall be effective on the date of " },
        {
          field_id: "v69y42",
          type: "field",
          children: [{ text: "[start_date]" }],
        },
        { text: " . This Power of Attorney shall terminate on the date of " },
        {
          field_id: "h1Iyi2",
          type: "field",
          children: [{ text: "[end_date]" }],
        },
        {
          text: " , unless it revoked sooner. This Power of Attorney may be revoked by me at any time or in any manner. This Power of Attorney ",
        },
        { field_id: "LePq_F", type: "field", children: [{ text: "[will]" }] },
        {
          text: " continue to be effective in the event of me getting incapacitated.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        { text: "This Power of Attorney shall be governed by " },
        {
          field_id: "sZrfz5",
          type: "field",
          children: [{ text: "[the_state]" }],
        },
        { text: " " },
      ],
    },
    {
      type: "paragraph",
      children: [
        { text: "Signed this " },
        { field_id: "v9w6DI", type: "field", children: [{ text: "[day]" }] },
        { text: " of " },
        { field_id: "9RBC_U", type: "field", children: [{ text: "[month]" }] },
        { text: ", " },
        { field_id: "UcDGp9", type: "field", children: [{ text: "[year]" }] },
        { text: "." },
      ],
    },
    { type: "paragraph", children: [{ text: "" }] },
    {
      type: "paragraph",
      children: [
        {
          field_id: "signature",
          type: "field",
          children: [{ text: "[SIGNATURE]" }],
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        { text: "________________________________________ (Sign Here)" },
      ],
    },
  ],
  fields: {
    Wlx8iV: {
      id: "Wlx8iV",
      type: "text",
      name: "principal_name",
      options: { max: 50 },
    },
    "9Sv-Rd": {
      id: "9Sv-Rd",
      type: "text",
      name: "principal_address",
      options: { max: 50 },
    },
    hjnif9: {
      id: "hjnif9",
      type: "text",
      name: "agent_name",
      options: { max: 50 },
    },
    "5FDurB": {
      id: "5FDurB",
      type: "text",
      name: "agent_address",
      options: { max: 50 },
    },
    Dpy12k: {
      id: "Dpy12k",
      type: "text",
      name: "matters",
      options: { max: 50, input: "textarea" },
    },
    v69y42: {
      id: "v69y42",
      type: "date",
      name: "start_date",
      options: { format: "DD/MM/YYYY" },
    },
    LePq_F: {
      id: "LePq_F",
      type: "select",
      name: "will",
      options: { options: ["will", "will not"], default: "will not" },
      default: "will",
    },
    sZrfz5: {
      id: "sZrfz5",
      type: "text",
      name: "the_state",
      options: { max: 50 },
      default: "The Republic of Indonesia",
    },
    v9w6DI: { id: "v9w6DI", type: "text", name: "day", options: { max: 50 } },
    "9RBC_U": {
      id: "9RBC_U",
      type: "text",
      name: "month",
      options: { max: 50 },
    },
    UcDGp9: { id: "UcDGp9", type: "text", name: "year", options: { max: 50 } },
    h1Iyi2: {
      id: "h1Iyi2",
      options: { format: "DD/MM/YYYY" },
      name: "end_date",
      type: "date",
    },
    signature: {
      id: "signature",
      type: "signature",
      name: "SIGNATURE",
      options: { width: 300, height: 100 },
    },
  },
  owner: { email: "", name: "", id: "" },
};

export const defaultResponse: LiteformResponse = {
  id: nanoid(6),
  responses: {
    hJ6Z6g: "John Doe",
  },
  respondent: {
    email: "",
    name: "",
    id: "",
  },
  responded_at: new Date(),
};

export enum LiteformMode {
  EDIT = "EDIT",
  RESPONSE = "RESPONSE",
}

export const FormContext = createContext(
  {
    mode: LiteformMode.EDIT,
    form: defaultForm,
    response: undefined as LiteformResponse | undefined,
  },
  (modify) => ({
    updateField: (id: string, props: { options: any; name: string }) => {
      modify((state) => {
        state.form.fields[id].options = props.options;
        state.form.fields[id].name = props.name;
      });
    },
    setSource: (source: Descendant[]) => {
      modify((state) => {
        state.form.source = source;
      });
    },
    addField: (field: FormField) => {
      modify((state) => {
        state.form.fields[field.id] = field;
      });
    },
    deleteField: (id: string) => {
      modify((state) => {
        delete state.form.fields[id];
      });
    },
    updateResponse: (id: string, value: any) => {
      modify((state) => {
        state.response!.responses[id] = value;
      });
    },
    setResponse(response: LiteformResponse) {
      modify((state) => {
        state.response = response;
      });
    },
    setForm(form: LiteformForm) {
      modify((state) => {
        state.form = form;
      });
    },
    setMode(mode: LiteformMode) {
      modify((state) => {
        state.mode = mode;
      });
    },
    setMetadata(metadata: Pick<LiteformForm, "name" | "description">) {
      modify((state) => {
        state.form.name = metadata.name;
        state.form.description = metadata.description;
      });
    },
  })
);
