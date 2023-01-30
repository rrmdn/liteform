import LiteformEditor from "../../app/components/LiteformEditor";

export default function Home() {
  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: "1024px",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        padding: "0 16px",
      }}
    >
      <div style={{height: 40}}></div>
      <LiteformEditor width={640} />
    </div>
  );
}
