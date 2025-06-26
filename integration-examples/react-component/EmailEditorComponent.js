import React, { useCallback, useEffect } from "react";
import { EmailEditor as Designer } from "../../app/src/core/design/EmailEditor";
import { SettingsProvider } from "../../app/src/context/SettingsContext";
import { restoreSettings } from "../../app/src/utils/settings";
import useIsMountedRef from "../../app/src/hooks/useIsMountedRef";
import { decodeJson } from "../../app/src/core/design/utils/encryptJson";
import ViewPreviewDialog from "../../app/src/core/design/preview/ViewPreviewDialog";
import ViewHtmlDialog from "../../app/src/core/design/preview/ViewHtmlDialog";

/**
 * Reusable Email Editor Component for integration into other React applications
 * 
 * @param {Object} props
 * @param {string} props.initialState - Initial editor state (encoded JSON)
 * @param {function} props.onSave - Callback when editor state is saved
 * @param {function} props.onPreview - Callback when preview is opened
 * @param {function} props.onHtmlView - Callback when HTML view is opened
 * @param {Object} props.settings - Custom settings for the editor
 * @param {string} props.height - Height of the editor (default: "600px")
 * @param {string} props.width - Width of the editor (default: "100%")
 */
export function EmailEditorComponent({
    initialState = null,
    onSave = () => {},
    onPreview = () => {},
    onHtmlView = () => {},
    settings = null,
    height = "600px",
    width = "100%"
}) {
    const isMountedRef = useIsMountedRef();
    const [state, setState] = React.useState(null);
    const [triggerFetchState, setTriggerFetchState] = React.useState(false);
    const [previewState, setPreviewState] = React.useState(null);
    const [htmlState, setHtmlState] = React.useState(null);
    const [mode, setMode] = React.useState("");

    const parseState = useCallback(stateArg => {
        var stateJson = null;
        var stateVersion = "";
        try {
            if (stateArg) {
                const stateVal = decodeJson(stateArg);
                if (stateVal) {
                    var tmp = JSON.parse(stateVal);
                    stateJson = tmp["json"];
                    stateVersion = tmp["version"];
                }
            }
        } catch (err) {
            console.error("Invalid Editor State:", err);
            return null;
        }
        setState({ json: stateJson, version: stateVersion });
    }, []);

    const getState = obj => {
        onSave(obj);
        if (mode === "preview") {
            setPreviewState(obj.html);
            onPreview(obj.html);
        } else if (mode === "html") {
            setHtmlState(obj.html);
            onHtmlView(obj.html);
        }
        setTriggerFetchState(false);
    };

    const onClose = () => {
        setMode("");
    };

    const onPreviewOpen = () => {
        setMode("preview");
        setTriggerFetchState(true);
    };

    const onHtmlOpen = () => {
        setMode("html");
        setTriggerFetchState(true);
    };

    // Initialize state on mount or when initialState changes
    useEffect(() => {
        if (initialState) {
            parseState(initialState);
        } else {
            // Initialize with empty state
            setState({ json: null, version: "1.0.0" });
        }
    }, [initialState, parseState]);

    const editorSettings = settings || restoreSettings();

    return (
        <div style={{ height, width, overflow: "hidden" }}>
            <SettingsProvider settings={editorSettings}>
                {state && Object.keys(state).length > 0 ? (
                    <>
                        <Designer
                            loadState={state["json"]}
                            loadVersion={state["version"]}
                            triggerFetchState={triggerFetchState}
                            getState={getState}
                            onPreviewOpen={onPreviewOpen}
                            onHtmlOpen={onHtmlOpen}
                        />
                        {mode === "preview" && (
                            <ViewPreviewDialog previewDoc={previewState} onClose={onClose} title="Preview" />
                        )}
                        {mode === "html" && <ViewHtmlDialog html={htmlState} onClose={onClose} />}
                    </>
                ) : (
                    <div>Loading editor...</div>
                )}
            </SettingsProvider>
        </div>
    );
}

export default EmailEditorComponent;
