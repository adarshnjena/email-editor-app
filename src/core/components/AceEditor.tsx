import React from 'react';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import AceEditor from 'react-ace';

interface EditorProps {
  className?: string;
  value?: string;
  mode?: string;
  isView?: boolean;
  height?: string | number;
  width?: string | number;
  isDark?: boolean;
  defaultValue?: string;
  cursorStart?: number;
  onChange?: (value: string, event: any) => void;
  onPaste?: (content: string) => void;
  disableSyntaxCheck?: boolean;
  onBlur?: (event: any) => void;
  name?: string;
  onLoad?: (editor: any) => void;
}

export function Editor({
  className,
  value,
  mode,
  isView,
  height,
  width,
  isDark,
  defaultValue,
  cursorStart,
  onChange,
  onPaste,
  disableSyntaxCheck,
  onBlur,
  name,
  onLoad,
}: EditorProps) {
  const handleChange = (value1: string) => {
    if (onChange) {
      let ev = {
        target: {
          value: value1,
          name: name,
        },
      };
      onChange(value1, ev);
    }
  };

  const handleBlur = (event: any) => {
    if (onBlur) {
      event.target.name = name;
      onBlur(event);
    }
  };

  const handlePaste = (content: string) => {
    if (onPaste) onPaste(content);
  };

  const theme = isDark ? 'monokai' : 'textmate';

  return (
    <AceEditor
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      onBlur={handleBlur}
      defaultValue={defaultValue}
      theme={theme}
      mode={mode}
      width={width ? String(width) : '100%'}
      readOnly={isView}
      wrapEnabled={true}
      height={height ? String(height) : undefined}
      onLoad={onLoad}
      enableLiveAutocompletion={true}
      enableBasicAutocompletion={true}
      editorProps={{ $blockScrolling: true }}
      focus={true}
      cursorStart={cursorStart}
      setOptions={{
        fontSize: 14,
        useWorker: !disableSyntaxCheck,
      }}
      navigateToFileEnd={false}
      name={name}
      style={{
        borderRadius: '5px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#D3D3D3',
      }}
    />
  );
}
