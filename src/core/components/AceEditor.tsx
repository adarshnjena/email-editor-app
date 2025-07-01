import React from "react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import AceEditor from "react-ace";

// export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
//   constructor() {
//     super();
//     this.$rules = {
//       start: [
//         {
//           token: "keyword",
//           regex: "{{(\s)*\w+(\s)*}}"
//         }
//       ]
//     };
//   }
// }

function Editor({
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
    onLoad
}) {
    const handleChange = value1 => {
        if (onChange) {
            let ev = {
                target: {
                    value: value1,
                    name: name
                }
            };
            onChange(value1, ev);
        }
    };

    const handleBlur = event => {
        if (onBlur) {
            event.target.name = name;
            onBlur(event);
        }
    };

    const handlePaste = content => {
        if (onPaste) onPaste(content);
    };

    var theme = isDark ? "monokai" : "textmate";

    return (
        <AceEditor
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            theme={theme}
            mode={mode}
            width={width ? width : "100%"}
            readOnly={isView}
            wrapEnabled={true}
            height={height}
            onLoad={onLoad}
            enableLiveAutocompletion={true}
            enableBasicAutocompletion={true}
            editorProps={{ $blockScrolling: true }}
            focus={true}
            cursorStart={cursorStart}
            setOptions={{
                fontSize: 14,
                useWorker: !disableSyntaxCheck
            }}
            navigateToFileEnd={false}
            name={name}
            style={{
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#D3D3D3"
            }}
        />
    );
}

export default Editor;
