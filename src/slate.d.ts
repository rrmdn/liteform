// TypeScript users only add this code
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import { FormField } from "./app/components/LiteformContext";

type CustomElement = {
  type: string;
  children: (CustomText | CustomElement)[];
  align?: "left" | "center" | "right" | "justify";
  field_id?: string;
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
