import "react-image-crop/dist/ReactCrop.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import ReactCrop, { Crop } from "react-image-crop";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Tag,
  Upload,
} from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import { TbFileUpload } from "react-icons/tb";
import builder from "./builder";
import { useMutation } from "react-query";
import { app } from "../../firebase";
import { nanoid } from "nanoid";
import UserContext from "../UserContext";

// size in pixels
const photoAspectRatioTemplates: Array<{
  label: string;
  width: number;
  height: number;
  value: number;
}> = [
  { label: "passport", width: 105, height: 148, value: 0.71 },
  { label: "1x1", width: 100, height: 100, value: 1 },
  { label: "2x3", width: 200, height: 300, value: 0.67 },
];

export default builder
  .from({
    value: "/images/default-photo.jpg",
    options: { width: 105, height: 148 },
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
                    value={field.value}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Form.Item>
            <Form.Item label="Input type">
              <Select
                placeholder={"Select input type"}
                value={props.node.options.width / props.node.options.height}
                onChange={(value) => {
                  const template = photoAspectRatioTemplates.find(
                    (t) => t.value === value
                  );
                  if (!template) return;
                  props.form.setValue("options.width", template.width);
                  props.form.setValue("options.height", template.height);
                }}
                options={photoAspectRatioTemplates}
              />
            </Form.Item>
          </>
        );
      },
      ValueEditor: (props) => {
        const user = UserContext.useSelectState((state) => state.user);
        const [crop, setCrop] = React.useState<Crop>({
          unit: "px",
          width: props.node.options.width,
          height: props.node.options.height,
          x: 0,
          y: 0,
        });
        const aspectRatio = React.useMemo(
          () => props.node.options.width / props.node.options.height,
          [props.node.options.width, props.node.options.height]
        );
        const [open, setOpen] = React.useState(false);
        const [uploaded, setUploaded] = React.useState("");
        const imgRef = React.useRef<HTMLImageElement>(null);
        const value = props.form.getValues(props.node.name);
        const uploadCroppedImage = useMutation({
          mutationFn: async (crop: Crop) => {
            const user = app.auth().currentUser;
            if (!imgRef.current || !user) return;
            const croppedImage = await cropImage(imgRef.current, crop);
            const storage = getStorage(app);
            const storageRef = ref(
              storage,
              `/user/${user.uid}/images/${nanoid()}.jpg`
            );
            const snapshot = await uploadBytes(storageRef, croppedImage);
            const url = await getDownloadURL(snapshot.ref);
            return url;
          },
        });

        React.useEffect(
          function updateValue() {
            if (uploadCroppedImage.data) {
              props.form.setValue(props.node.name, uploadCroppedImage.data);
              setOpen(false);
              setUploaded("");
            }
          },
          [uploadCroppedImage.data]
        );

        const handleCrop = React.useCallback(() => {
          uploadCroppedImage.mutate(crop);
        }, [crop]);
        const src = uploaded || value;
        return (
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Modal
                title="Crop image"
                open={open}
                destroyOnClose
                onOk={handleCrop}
                confirmLoading={uploadCroppedImage.isLoading}
                cancelButtonProps={{ disabled: uploadCroppedImage.isLoading }}
                onCancel={() => {
                  setOpen(false);
                  setUploaded("");
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <ReactCrop
                      aspect={aspectRatio}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                    >
                      <img
                        ref={imgRef}
                        src={src}
                        style={{
                          minWidth: props.node.options.width,
                          minHeight: props.node.options.height,
                        }}
                      />
                    </ReactCrop>
                  </Col>
                  <Col span={24}>
                    {user ? (
                      <Upload
                        accept="image/*"
                        onChange={(info) => {
                          if (!info.file.originFileObj) return;
                          const dataURL = URL.createObjectURL(
                            info.file.originFileObj
                          );
                          setUploaded(dataURL);
                        }}
                      >
                        <Button icon={<TbFileUpload />} size="small">
                          Upload
                        </Button>
                      </Upload>
                    ) : (
                      <Tag color="red">Login to upload</Tag>
                    )}
                  </Col>
                </Row>
              </Modal>
              <Image
                src={value}
                width={props.node.options.width}
                height={props.node.options.height}
              />
            </Col>
            <Col span={24}>
              <Button
                size="small"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Add image
              </Button>
            </Col>
          </Row>
        );
      },
      ValueRenderer: (props) => {
        return (
          <img
            src={props.node.value}
            width={props.node.options.width}
            height={props.node.options.height}
            {...props.attributes}
          />
        );
      },
    }),
    {
      name: "Image",
      type: "image",
    }
  );

// https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o?file=/src/canvasPreview.ts

const TO_RADIANS = Math.PI / 180;

async function cropImage(
  image: HTMLImageElement,
  crop: Crop,
  scale = 1,
  rotate = 0
) {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("No blob");
      }
      resolve(blob);
    }, "image/jpeg");
  });
}
