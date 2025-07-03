import React, { useEffect } from "react";
import { Editor, useEditor } from "@craftjs/core";
import { Footer, RightPanel } from "./components/layoutComponents";
import {
    Button,
    Container,
    Text,
    Image,
    Video,
    HtmlBox,
    CustomDivider,
    Resizer,
    BodyWrapper
} from "./components/userComponents";
import { RenderNode } from "./utils/RenderNode";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { Design } from "./components/layoutComponents/Design";
import { jssPreset, StylesProvider, ThemeProvider } from "@material-ui/core";
import { create } from "jss";
import rtl from "jss-rtl";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "react-quill/dist/quill.snow.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "../../assets/css/devices.min.css";
import "../../assets/css/modern-ui.css";
import "braft-editor/dist/index.css";
import { createTheme } from "../../theme";
import { useSettings } from "../../hooks/useSettings";
import { encodeJson, decodeJson } from "./utils/encryptJson";
import { renderHtml } from "../repo/exportHtmlRepo";
import packageJson from "../../../package.json";

const { state_version } = packageJson;

const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8fafc"
    },
    mainContainer: {
        height: "100%",
        display: "flex",
        overflow: "hidden"
    },
    designSection: {
        flex: 1,
        height: "100%",
        overflow: "hidden"
    },
    rightPanelSection: {
        width: "380px",
        height: "100%",
        borderLeft: "1px solid #e0e0e0",
        backgroundColor: "#ffffff"
    }
}));

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

interface EmailEditorProps {
    loadState?: any;
    loadVersion?: string;
    triggerFetchState?: boolean;
    getState?: (result: any) => void;
    onPreviewOpen?: () => void;
    onHtmlOpen?: () => void;
}

export function EmailEditor({
    loadState,
    loadVersion,
    triggerFetchState,
    getState,
    onPreviewOpen,
    onHtmlOpen,
    ...rest
}: EmailEditorProps) {
    const classes = useStyles();
    const { settings } = useSettings();
    const [currentHtmlContent, setCurrentHtmlContent] = React.useState(null);
    const [currentEditorState, setCurrentEditorState] = React.useState(null);

    const handleStateUpdate = ({ editorState, htmlContent }) => {
        setCurrentEditorState(editorState);
        setCurrentHtmlContent(htmlContent);
    };

    const handleImportSuccess = (importedData) => {
        try {
            let jsonToImport = null;
            let versionToImport = state_version;
            
            // Handle different import formats based on structure
            if (typeof importedData === 'string') {
                // Encoded state - decode it first
                const decoded = decodeJson(importedData);
                const parsed = JSON.parse(decoded);
                jsonToImport = parsed.json;
                versionToImport = parsed.version || state_version;
            } else if (importedData.json && importedData.version) {
                // Our export format (json + version)
                if (typeof importedData.json === 'object') {
                    jsonToImport = JSON.stringify(importedData.json);
                } else {
                    jsonToImport = importedData.json;
                }
                versionToImport = importedData.version;
            } else if (importedData.json && typeof importedData.json === 'object') {
                // CraftJS state structure
                jsonToImport = JSON.stringify(importedData.json);
            } else if (importedData.ROOT) {
                // Raw CraftJS nodes
                jsonToImport = JSON.stringify(importedData);
            } else {
                // Fallback
                jsonToImport = JSON.stringify(importedData);
            }
            
            // Create the encoded state for the app to load
            const stateToLoad = encodeJson(JSON.stringify({ 
                json: jsonToImport, 
                version: versionToImport 
            }));
            
            // Set the global state and reload
            window.__editorState = stateToLoad;
            window.__version = versionToImport;
            window.location.reload();
        } catch (error) {
            console.error('Error handling import:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert('Error importing template: ' + errorMessage);
        }
    };

    return (
        <ThemeProvider theme={createTheme(settings)}>
            <StylesProvider jss={jss}>
                <div className={classes.root}>
                    <Editor
                        resolver={{
                            Button,
                            Container,
                            Text,
                            Image,
                            Video,
                            HtmlBox,
                            CustomDivider,
                            Resizer,
                            BodyWrapper
                        }}
                        onRender={RenderNode}
                    >
                        <div className={classes.mainContainer}>
                            <div className={classes.designSection}>
                                <Design editorState={loadState} onHtmlOpen={onHtmlOpen} />
                            </div>
                            <div className={classes.rightPanelSection}>
                                <RightPanel />
                            </div>
                        </div>
                        <Footer 
                            onPreviewOpen={onPreviewOpen} 
                            onHtmlOpen={onHtmlOpen}
                            editorState={currentEditorState}
                            htmlContent={currentHtmlContent}
                            onImportSuccess={handleImportSuccess}
                        />
                        <EditorSaveModule
                            triggerFetchState={triggerFetchState}
                            getState={getState}
                            version={loadVersion ? loadVersion : state_version}
                            onStateUpdate={handleStateUpdate}
                        />
                    </Editor>
                </div>
            </StylesProvider>
        </ThemeProvider>
    );
}

interface EditorSaveModuleProps {
    triggerFetchState?: boolean;
    getState?: (result: any) => void;
    version?: string;
    onStateUpdate?: (data: { editorState: any; htmlContent: any }) => void;
}

function EditorSaveModule({ triggerFetchState, getState, version, onStateUpdate }: EditorSaveModuleProps) {
    const { query } = useEditor();

    const fetchState = async () => {
        const json = query.serialize();
        var state = encodeJson(JSON.stringify({ json: json, version: version }));

        var html = null;
        try {
            const craftNodes = JSON.parse(json);
            html = await renderHtml(craftNodes);
        } catch (err) {
            console.log(err);
        }

        const result = {
            html: html,
            state: state
        };

        getState(result);
        
        // Update parent component with current state and HTML
        if (onStateUpdate) {
            onStateUpdate({
                editorState: { json: json, version: version }, // Keep json as string
                htmlContent: html
            });
        }
    };

    if (triggerFetchState) {
        fetchState();
    }

    return null;
}

// EmailEditor is already exported above with named export
