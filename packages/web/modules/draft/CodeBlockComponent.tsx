import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React from "react";

export const CodeBlockComponent: React.FC<NodeViewProps> = ({
  extension,
  node,
  editor,
  updateAttributes,
}) => {
  return (
    <NodeViewWrapper className="code-block relative">
      {editor.isEditable ? (
        <select
          className="absolute top-4 right-4 appearance-none bg-transparent cursor-pointer"
          contentEditable="false"
          value={node.attrs.language}
          onChange={(e) => {
            if (e.target.value) {
              updateAttributes({ language: e.target.value });
            }
          }}
        >
          <option value={undefined}>auto</option>
          <option disabled>—</option>
          {extension.options.lowlight
            .listLanguages()
            .map((language: string, key: number) => (
              <option value={language} key={key}>
                {language}
              </option>
            ))}
        </select>
      ) : null}
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};