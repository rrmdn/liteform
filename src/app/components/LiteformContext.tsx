import { nanoid } from "nanoid";
import { createContext } from "react-immersive";
import { Descendant } from "slate";

export type Identity = {
  email: string;
  name: string;
};

export type FormField<T = any> = {
  id: string;
  type: string;
  name: string;
  options: T;
};

export type LiteformForm = {
  id: string;
  name: string;
  description: string;
  source: Descendant[];
  fields: Record<string, FormField>;
  owner: Identity;
};

export type LiteformResponse = {
  id: string;
  responses: any;
  respondent: Identity;
};

export const defaultForm: LiteformForm = {
  id: nanoid(6),
  name: "Sample form",
  description: "Simple form with a single text field",
  source: [
    {
      type: "heading-one",
      children: [
        {
          text: "",
        },
      ],
      align: "center",
    },
    {
      type: "heading-one",
      align: "center",
      children: [
        {
          text: "Power of Attorney - Limited",
        },
      ],
    },
    {
      type: "heading-one",
      align: "center",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "I, ",
        },
        {
          field_id: "Wlx8iV",
          type: "field",
          children: [
            {
              text: "[principal_name]",
            },
          ],
        },
        {
          text: " of ",
        },
        {
          field_id: "9Sv-Rd",
          type: "field",
          children: [
            {
              text: "[principal_address]",
            },
          ],
        },
        {
          text: ", the undersigned, hereby appoint and make ",
        },
        {
          field_id: "hjnif9",
          type: "field",
          children: [
            {
              text: "[agent_name]",
            },
          ],
        },
        {
          text: " of ",
        },
        {
          field_id: "5FDurB",
          type: "field",
          children: [
            {
              text: "[agent_address]",
            },
          ],
        },
        {
          text: " as my attorney-in-fact who shall have full power and authority to represent me and act on my behalf for ONLY the following matters:",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "",
        },
        {
          field_id: "Dpy12k",
          type: "field",
          children: [
            {
              text: "[matters]",
            },
          ],
        },
        {
          text: " ",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This Power of Attorney shall be effective on the date of ",
        },
        {
          field_id: "v69y42",
          type: "field",
          children: [
            {
              text: "[start_date]",
            },
          ],
        },
        {
          text: " .",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This Power of Attorney shall terminate on the date of ",
        },
        {
          field_id: "cNQIVx",
          type: "field",
          children: [
            {
              text: "[end_date]",
            },
          ],
        },
        {
          text: ", unless it revoked sooner.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This Power of Attorney may be revoked by me at any time or in any manner.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This Power of Attorney ",
        },
        {
          field_id: "LePq_F",
          type: "field",
          children: [
            {
              text: "[will]",
            },
          ],
        },
        {
          text: " continue to be effective in the event of me getting",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "incapacitated.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This Power of Attorney shall be governed by ",
        },
        {
          field_id: "sZrfz5",
          type: "field",
          children: [
            {
              text: "[the_state]",
            },
          ],
        },
        {
          text: " ",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Signed this ",
        },
        {
          field_id: "v9w6DI",
          type: "field",
          children: [
            {
              text: "[day]",
            },
          ],
        },
        {
          text: " of ",
        },
        {
          field_id: "9RBC_U",
          type: "field",
          children: [
            {
              text: "[month]",
            },
          ],
        },
        {
          text: ", ",
        },
        {
          field_id: "UcDGp9",
          type: "field",
          children: [
            {
              text: "[year]",
            },
          ],
        },
        {
          text: ".",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "________________________________________ (Sign Here)",
        },
      ],
    },
  ],
  fields: {
    Wlx8iV: {
      id: "Wlx8iV",
      type: "text",
      name: "principal_name",
      options: {
        max: 50,
      },
    },
    "9Sv-Rd": {
      id: "9Sv-Rd",
      type: "text",
      name: "principal_address",
      options: {
        max: 50,
      },
    },
    hjnif9: {
      id: "hjnif9",
      type: "text",
      name: "agent_name",
      options: {
        max: 50,
      },
    },
    "5FDurB": {
      id: "5FDurB",
      type: "text",
      name: "agent_address",
      options: {
        max: 50,
      },
    },
    Dpy12k: {
      id: "Dpy12k",
      type: "text",
      name: "matters",
      options: {
        max: 50,
        input: "textarea",
      },
    },
    v69y42: {
      id: "v69y42",
      type: "date",
      name: "start_date",
      options: {
        max: 50,
      },
    },
    cNQIVx: {
      id: "cNQIVx",
      type: "date",
      name: "end_date",
      options: {
        max: 50,
      },
    },
    LePq_F: {
      id: "LePq_F",
      type: "select",
      name: "will",
      options: {
        options: ["will", "will not"],
        default: "will not",
      },
    },
    sZrfz5: {
      id: "sZrfz5",
      type: "text",
      name: "the_state",
      options: {
        max: 50,
      },
    },
    v9w6DI: {
      id: "v9w6DI",
      type: "text",
      name: "day",
      options: {
        max: 50,
      },
    },
    "9RBC_U": {
      id: "9RBC_U",
      type: "text",
      name: "month",
      options: {
        max: 50,
      },
    },
    UcDGp9: {
      id: "UcDGp9",
      type: "text",
      name: "year",
      options: {
        max: 50,
      },
    },
  },
  owner: {
    email: "",
    name: "",
  },
};

export const defaultResponse: LiteformResponse = {
  id: nanoid(6),
  responses: {
    hJ6Z6g: "John Doe",
  },
  respondent: {
    email: "",
    name: "",
  },
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
    updateResponse: (id: string, value: any) => {
      modify((state) => {
        state.response!.responses[id] = value;
      });
    },
    setResponse(response: LiteformResponse) {
      modify((state) => {
        state.response = response
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
  })
);
