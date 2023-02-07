import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RenderElementProps } from "slate-react";
import { FormField } from "./components/LiteformContext";

export type Node<TOpt = any, TVal = any> = FormField<TOpt, TVal> & {
  value?: TVal;
};

type Factory<TOpt, TVal> = {
  build(
    obj: Partial<Omit<Node<TOpt, TVal>, "type" | "name">>
  ): Node<TOpt, TVal>;
  defaultNode: Node<TOpt, TVal>;
  OptionsEditor: React.FC<{
    node: Node<TOpt, TVal>;
    form: UseFormReturn<Pick<Node<TOpt, TVal>, "options" | "name" | "default">>;
  }>;
  ValueEditor: React.FC<{
    node: Node<TOpt, TVal>;
    form: UseFormReturn<Record<string, Node<TOpt, TVal>["value"]>>;
  }>;
  ValueRenderer: React.FC<{
    node: Pick<Node<TOpt, TVal>, "value" | "options">;
    style?: React.CSSProperties;
    attributes: RenderElementProps['attributes']
  }>;
};

export default class FactoryBuilder {
  public factories: Record<string, Factory<any, any>> = {};
  from<TOpt, TVal>(defaults: Pick<Node<TOpt, TVal>, "options" | "value">) {
    return {
      build: (
        factory: () => Omit<
          Factory<TOpt, TVal>,
          "schema" | "defaultNode" | "build"
        >,
        metadata: { type: string; name: string }
      ) => {
        // @ts-ignore - yeah yeah, I know
        const defaultNode: TNode = {
          id: Math.random().toString(36).substr(2, 9),
          options: defaults.options,
          value: defaults.value,
          default: defaults.value,
          ...metadata,
        };
        const Factory: Factory<TOpt, TVal> = {
          ...factory(),
          defaultNode,
          build: function (node) {
            return { ...defaultNode, ...node };
          },
        };
        // @ts-ignore
        this.factories[metadata.type] = Factory;
        return Factory;
      },
    };
  }
}
