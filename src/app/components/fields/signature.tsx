import { Button, Col, Form, Input, Row, Space } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import SignaturePad from "signature_pad";
import * as openpgp from "openpgp/lightweight";
import builder from "./builder";
import { FormContext } from "../LiteformContext";

function RenderSignature(props: Partial<typeof defaultValue>) {
  return (
    <div style={{ position: "relative", width: 300, height: 150 }}>
      <img src={props.src} style={{ width: 300, height: 150 }} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 300,
          height: 150,
          color: "rgba(0,0,0,0.2)",
          background: "transparent",
          padding: 10,
          fontSize: 8,
          overflow: "hidden",
          wordWrap: "break-word",
        }}
      >
        <pre>{props.signature || "unsigned"}</pre>
        <pre style={{ position: "absolute", bottom: 10, right: 10, left: 10 }}>
          {props?.signed_at?.toISOString()}
        </pre>
      </div>
    </div>
  );
}

const defaultValue = { src: "", signature: "unsigned", signed_at: new Date() };

export default builder
  .from({
    value: defaultValue,
    options: { width: 240, height: 135 },
  })
  .build(
    () => ({
      OptionsEditor: (props) => {
        return (
          <>
            <Form.Item label="Width">
              <Controller
                control={props.form.control}
                name="options.width"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={"Enter width"}
                    onChange={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Form.Item>
            <Form.Item label="Height">
              <Controller
                control={props.form.control}
                name="options.height"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={"Enter height"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
              />
            </Form.Item>
          </>
        );
      },
      ValueEditor: (props) => {
        const canvasRef = React.useRef<HTMLCanvasElement>(null);
        const signatureRef = React.useRef<SignaturePad>();
        const formId = FormContext.useSelectState((state) => state.form.id);
        const [state, setState] = React.useState({
          isEditing: false,
        });
        React.useEffect(() => {
          const timeout = setTimeout(() => {
            if (!canvasRef.current) return;
            signatureRef.current = new SignaturePad(canvasRef.current, {
              penColor: "rgb(66, 133, 244)",
              backgroundColor: "rgb(255, 255, 255)",
            });
          }, 200);
          return () => {
            clearTimeout(timeout);
          };
        }, [state.isEditing]);
        const handleSave = React.useCallback(async () => {
          const src = signatureRef.current?.toDataURL() || "";
          const signed_at = new Date();
          const message = await openpgp.createMessage({
            text: JSON.stringify({ src, signed_at, form_id: formId }),
          });
          let signature = "unsigned";
          try {
            const keypair = localStorage.getItem("keypair");
            const serializedKeypair = JSON.parse(
              keypair || ""
            ) as openpgp.SerializedKeyPair<string> & {
              revocationCertificate: string;
            };

            const detached = await openpgp.sign({
              message,
              signingKeys: await openpgp.readPrivateKey({
                armoredKey: serializedKeypair.privateKey,
              }),
              detached: true,
            });
            signature = detached as string;
          } catch (error) {
            console.error(error);
          }

          props.form.setValue(props.node.name, {
            src,
            signature,
            signed_at,
          });
          setState({ isEditing: false });
        }, [formId, props.form, props.node.name]);
        const value = props.form.getValues(props.node.name);
        return (
          <div>
            {state.isEditing ? (
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <canvas
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "4px",
                    }}
                    ref={canvasRef}
                  />
                </Col>
                <Col span={24}>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => {
                        signatureRef.current?.clear();
                      }}
                    >
                      Clear
                    </Button>
                    <Button size="small" type="primary" onClick={handleSave}>
                      Save
                    </Button>
                  </Space>
                </Col>
              </Row>
            ) : (
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <RenderSignature {...value} />
                </Col>

                <Button
                  size="small"
                  onClick={() => {
                    setState({ isEditing: true });
                  }}
                >
                  Edit
                </Button>
              </Row>
            )}
          </div>
        );
      },
      ValueRenderer: (props) => {
        return <RenderSignature {...props.node.value} />;
      },
    }),
    {
      name: "Signature",
      type: "signature",
    }
  );
