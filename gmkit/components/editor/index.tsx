import { useRef, CSSProperties, useEffect } from 'react';
import { schema } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

export interface EditorProps {
  style?: CSSProperties;
}
export function Editor({ style }) {
  const editorRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const view = new EditorView(editorRef.current, {
      state: EditorState.create({
        schema,
        plugins: createPlugins(schema),
      }),
    });

    return () => view.destroy();
  }, [editorRef.current]);

  return <div ref={editorRef} style={style} />;
}

function createPlugins(schema: Schema) {
  return [
    keymap(baseKeymap),
    inputRules({
      rules: [headingRule(schema.nodes.heading, 4)],
    }),
    dropCursor(),
    gapCursor(),
  ];
}

function headingRule(nodeType, maxLevel) {
  return textblockTypeInputRule(
    new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    (match) => ({ level: match[1].length })
  );
}
