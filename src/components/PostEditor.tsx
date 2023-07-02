"use client";

// -> Beyond codebase
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import TextAreaAutoSize from "react-textarea-autosize";
import type EditorJS from "@editorjs/editorjs";
// -> Within codebase

type PostEditorProps = {
  subredditId: string;
}

const PostEditor = (props: PostEditorProps) => {
  const { subredditId } = props;

  const {
    register, handleSubmit, formState: { errors }
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    }
  });

  const editorRef = useRef<EditorJS>();
  
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!editorRef.current) {
      const editor: EditorJS = new EditorJS({
        holder: "editor",
        onReady: () => editorRef.current = editor,
        placeholder: "Type here to add your post content",
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  
                }
              }
            }
          }
        }
      })
    }
  }, []);

  return (
    <div className="w-full p-4 bg-zinc-500 rounded-lg-border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={() => {}}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextAreaAutoSize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  )
}

export default PostEditor
