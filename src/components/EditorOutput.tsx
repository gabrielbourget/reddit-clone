// -> Beyond codebase
import dynamic from "next/dynamic";
import Image from "next/image";
// -> Within codebase

const Output = dynamic(async () => (await import("editorjs-react-renderer")).default, { ssr: false });

type EditorOutputProps = {
  content: any
}

const style = {
  paragraph: { fontSize: "0.875rem", lineHeight: "1.25rem" }
}

const renderers = {
  image: CustomImageRenderer,
  // code: CustomCodeRenderer
};

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  )
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image
        alt="Post Image"
        className="object-contain"
        fill
        src={src}
      />
    </div>
  );
}

export default EditorOutput
