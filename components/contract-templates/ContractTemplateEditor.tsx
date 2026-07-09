import { contractVariables, getVariablesByCategory } from "@/lib/contract-generation/variables";
import { Variable } from "@/lib/tiptap/variable";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading1, Heading2, Heading3, List, ListOrdered, VariableIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import tippy from "tippy.js";
import type { Instance as TippyInstance } from "tippy.js";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { VariableMenu } from "./VariableMenu";

interface ContractTemplateEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({
  initialContent = "",
  onChange,
  onSave,
}) => {
  const [isVariableMenuOpen, setIsVariableMenuOpen] = useState(false);
  const groupedVariables = getVariablesByCategory();
  const categories = Object.keys(groupedVariables);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Variable.configure({
        HTMLAttributes: {
          class: "variable-tag",
        },
        suggestion: {
          char: "{{",
          items: ({ query }) => {
            return contractVariables
              .filter((variable) => {
                const searchText = query.toLowerCase();
                return (
                  variable.label.toLowerCase().includes(searchText) ||
                  variable.id.toLowerCase().includes(searchText)
                );
              })
              .slice(0, 10);
          },
          render: () => {
            // biome-ignore lint/suspicious/noExplicitAny: ReactRenderer requires any type
            let component: ReactRenderer<any>;
            let popup: TippyInstance[];

            return {
              onStart: (props) => {
                component = new ReactRenderer(VariableMenu, {
                  props: {
                    ...props,
                    onSelect: (variable: { id: string; label: string }) => {
                      props.command(variable);
                    },
                  },
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy("body", {
                  // biome-ignore lint/suspicious/noExplicitAny: Tippy requires flexible type
                  getReferenceClientRect: props.clientRect as any,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate(props) {
                component.updateProps({
                  ...props,
                  onSelect: (variable: { id: string; label: string }) => {
                    props.command(variable);
                  },
                });

                if (!props.clientRect) {
                  return;
                }

                popup[0]?.setProps({
                  // biome-ignore lint/suspicious/noExplicitAny: Tippy requires flexible type
                  getReferenceClientRect: props.clientRect as any,
                });
              },

              onKeyDown(props) {
                if (props.event.key === "Escape") {
                  popup[0]?.hide();
                  return true;
                }

                // biome-ignore lint/suspicious/noExplicitAny: Component ref type is dynamic
                return (component.ref as any)?.onKeyDown?.(props.event) || false;
              },

              onExit() {
                popup[0]?.destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  const insertVariable = (variableId: string) => {
    const variable = contractVariables.find((v) => v.id === variableId);
    if (variable && editor) {
      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "variable",
            attrs: {
              id: variable.id,
              label: variable.label,
            },
          },
          {
            type: "text",
            text: " ",
          },
        ])
        .run();
      setIsVariableMenuOpen(false);
    }
  };

  const handleSave = () => {
    if (editor) {
      const html = editor.getHTML();
      onSave?.(html);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col p-3 border border-border rounded-lg shadow-sm">
      {/** Title */}
      <h1 className="w-full flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold">EDITOR DE TEMPLATE</h1>
        <Button type="button" onClick={handleSave} variant="default">
          ATUALIZAR TEMPLATE
        </Button>
      </h1>
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-2 border-b border-primary/10 p-3">
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive("italic") ? "default" : "ghost"}
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            variant={editor.isActive("strike") ? "default" : "ghost"}
          >
            <s>S</s>
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            variant={editor.isActive("paragraph") ? "default" : "ghost"}
          >
            P
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          >
            <Heading1 className="w-4 h-4 min-w-4 min-h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          >
            <Heading2 className="w-4 h-4 min-w-4 min-h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
          >
            <Heading3 className="w-4 h-4 min-w-4 min-h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive("bulletList") ? "default" : "ghost"}
          >
            <List className="w-4 h-4 min-w-4 min-h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive("orderedList") ? "default" : "ghost"}
          >
            <ListOrdered className="w-4 h-4 min-w-4 min-h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Variable Insert Button */}
        <Popover open={isVariableMenuOpen} onOpenChange={setIsVariableMenuOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="secondary" className="flex items-center gap-1">
              <VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
              INSERIR VARIÁVEL
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {categories.map((category) => (
                  <div key={category} className="mb-3">
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {groupedVariables[category].map((variable) => (
                        <button
                          key={variable.id}
                          type="button"
                          className="w-full flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100"
                          onClick={() => insertVariable(variable.id)}
                        >
                          <VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
                          <span className="text-xs font-medium uppercase">{variable.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose max-w-none p-6 h-full"
          suppressHydrationWarning
        />
      </div>
      {/* Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 100%;
          outline: none;
        }

        .ProseMirror p {
          margin: 0.5rem 0;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2rem;
        }

        .variable-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          border: 1px solid rgb(59 130 246 / 0.3);
          background-color: rgb(219 234 254);
          color: rgb(30 64 175);
          padding: 0.125rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          margin: 0 0.125rem;
          transition: background-color 0.2s;
        }

        .variable-tag:hover {
          background-color: rgb(191 219 254);
        }

        @media (prefers-color-scheme: dark) {
          .variable-tag {
            background-color: rgb(30 58 138);
            color: rgb(191 219 254);
            border-color: rgb(59 130 246 / 0.5);
          }

          .variable-tag:hover {
            background-color: rgb(29 78 216);
          }
        }

        .dark .variable-tag {
          background-color: rgb(30 58 138);
          color: rgb(191 219 254);
          border-color: rgb(59 130 246 / 0.5);
        }

        .dark .variable-tag:hover {
          background-color: rgb(29 78 216);
        }
      `}</style>
    </div>
  );
};

export default ContractTemplateEditor;
