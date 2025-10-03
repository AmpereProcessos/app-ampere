import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { Variable } from "@/lib/tiptap/variable";
import type { TGetContractTemplateVariablesOutputDefault } from "@/pages/api/templates-contrato/variaveis";
import { useContractTemplateVariables } from "@/utils/methods/query/contract-templates-variables";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Command, FileText, Heading1, Heading2, Heading3, List, ListOrdered, VariableIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Instance as TippyInstance } from "tippy.js";
import tippy from "tippy.js";

type TemplateEditorProps = {
	content: string;
	contentChangeCallback: (content: string) => void;
	contractVariables: TGetContractTemplateVariablesOutputDefault;
};
function ContractTemplateEditor({ content, contentChangeCallback, contractVariables }: TemplateEditorProps) {
	const [variableMenuIsOpen, setVariableMenuIsOpen] = useState(false);
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
								return variable.titulo.toLowerCase().includes(searchText) || variable.identificador.toLowerCase().includes(searchText);
							})
							.slice(0, 10);
					},
					render: () => {
						// biome-ignore lint/suspicious/noExplicitAny: ReactRenderer requires any type
						let component: ReactRenderer<any>;
						let popup: TippyInstance[];

						return {
							onStart: (props) => {
								component = new ReactRenderer(ContractTemplateEditorVariableMenu, {
									props: {
										...props,
										handleSelectVariable: (variable: TGetContractTemplateVariablesOutputDefault[number]) => {
											props.command(variable);
										},
										contractVariables: contractVariables,
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
									handleSelectVariable: (variable: TGetContractTemplateVariablesOutputDefault[number]) => {
										props.command(variable);
									},
									contractVariables: contractVariables,
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
		content: content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			console.log("[DEBUG] Editor Updated", {
				html: editor.getHTML(),
				json: editor.getJSON(),
				text: editor.getText(),
			});
			const html = editor.getHTML();
			contentChangeCallback(html);
		},
	});
	const handleInsertVariable = (variableId: string) => {
		const variable = contractVariables.find((v) => v._id === variableId);
		if (variable && editor) {
			editor
				.chain()
				.focus()
				.insertContent([
					{
						type: "variable",
						attrs: {
							id: variable._id,
							label: variable.titulo,
						},
					},
					{
						type: "text",
						text: " ",
					},
				])
				.run();
			setVariableMenuIsOpen(false);
		}
	};
	if (!editor) return null;
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="EDITOR DE TEMPLATE" sectionTitleIcon={<FileText size={15} />}>
			<div className="flex items-center flex-wrap gap-2 border-b border-primary/10 p-3">
				<div className="flex gap-1">
					<Button
						type="button"
						size="sm"
						variant={editor.isActive("bold") ? "default" : "ghost"}
						onClick={() => editor.chain().focus().toggleBold().run()}
					>
						<strong>B</strong>
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						variant={editor.isActive("italic") ? "default" : "ghost"}
					>
						<em>I</em>
					</Button>
					<Button
						type="button"
						size="sm"
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
						size="sm"
						onClick={() => editor.chain().focus().setParagraph().run()}
						variant={editor.isActive("paragraph") ? "default" : "ghost"}
					>
						P
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
					>
						<Heading1 className="w-4 h-4 min-w-4 min-h-4" />
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
					>
						<Heading2 className="w-4 h-4 min-w-4 min-h-4" />
					</Button>
					<Button
						type="button"
						size="sm"
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
						size="sm"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						variant={editor.isActive("bulletList") ? "default" : "ghost"}
					>
						<List className="w-4 h-4 min-w-4 min-h-4" />
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						variant={editor.isActive("orderedList") ? "default" : "ghost"}
					>
						<ListOrdered className="w-4 h-4 min-w-4 min-h-4" />
					</Button>
				</div>

				<div className="h-6 w-px bg-gray-300" />

				{/* Variable Insert Button */}
				<Popover open={variableMenuIsOpen} onOpenChange={setVariableMenuIsOpen}>
					<PopoverTrigger asChild>
						<Button type="button" size="sm" variant="secondary" className="flex items-center gap-1">
							<VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
							INSERIR VARIÁVEL
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-[400px] p-0 h-[400px] max-h-[400px] overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30"
						align="start"
					>
						{contractVariables.map((variable) => (
							<button
								key={variable._id}
								type="button"
								className="w-full flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-100"
								onClick={() => handleInsertVariable(variable._id)}
							>
								<VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
								<span className="text-xs font-medium uppercase">{variable.titulo}</span>
							</button>
						))}
					</PopoverContent>
				</Popover>
			</div>
			<EditorContent editor={editor} className="prose max-w-none p-6 h-full" suppressHydrationWarning />
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
		</ResponsiveDialogDrawerSection>
	);
}
export default ContractTemplateEditor;

type ContractTemplateEditorVariableMenuProps = {
	query: string;
	handleSelectVariable: (variable: TGetContractTemplateVariablesOutputDefault[number]) => void;
	contractVariables: TGetContractTemplateVariablesOutputDefault;
};
function ContractTemplateEditorVariableMenu({ query, handleSelectVariable, contractVariables }: ContractTemplateEditorVariableMenuProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const filteredVariables = contractVariables.filter((variable) => {
		const searchText = query.toLowerCase();
		return variable.titulo.toLowerCase().includes(searchText) || variable.identificador.toLowerCase().includes(searchText);
	});

	useEffect(() => {
		setSelectedIndex(0);
	}, []);
	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredVariables.length - 1));
				event.preventDefault();
				return true;
			}

			if (event.key === "ArrowDown") {
				setSelectedIndex((prevIndex) => (prevIndex < filteredVariables.length - 1 ? prevIndex + 1 : 0));
				event.preventDefault();
				return true;
			}

			if (event.key === "Enter") {
				const selectedVariable = filteredVariables[selectedIndex];
				if (selectedVariable) {
					handleSelectVariable(selectedVariable);
				}
				event.preventDefault();
				return true;
			}

			return false;
		},
		[filteredVariables, selectedIndex, handleSelectVariable],
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);
	if (filteredVariables.length === 0) {
		return (
			<Command className="rounded-lg border shadow-md w-[400px]">
				<CommandList>
					<CommandEmpty>Nenhuma variável encontrada</CommandEmpty>
				</CommandList>
			</Command>
		);
	}

	return (
		<Command className="rounded-lg border shadow-md w-[400px] h-[400px] scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
			<CommandList>
				<CommandGroup heading="Resultados">
					{filteredVariables.map((variable, index) => (
						<CommandItem
							key={variable._id}
							value={variable._id}
							onSelect={() => handleSelectVariable(variable)}
							className="flex items-start gap-1 cursor-pointer border border-primary/10 px-3 rounded hover:bg-blue-100"
						>
							<VariableIcon className="w-4 h-4 min-w-4 min-h-4" />
							<span className="text-xs font-medium uppercase">{variable.titulo}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
