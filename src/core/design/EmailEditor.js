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
import Design from "./components/layoutComponents/Design";
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
import useSettings from "../../hooks/useSettings";
import { encodeJson } from "./utils/encryptJson";
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
        borderLeft: "1px solid #e2e8f0",
        backgroundColor: "#ffffff"
    }
}));

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function EmailEditor({
    loadState,
    loadVersion,
    triggerFetchState,
    getState,
    onPreviewOpen,
    onHtmlOpen,
    ...rest
}) {
    const classes = useStyles();
    const { settings } = useSettings();

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
                                <Design editorState={loadState} />
                            </div>
                            <div className={classes.rightPanelSection}>
                                <RightPanel />
                            </div>
                        </div>
                        <Footer onPreviewOpen={onPreviewOpen} onHtmlOpen={onHtmlOpen} />
                        <EditorSaveModule
                            triggerFetchState={triggerFetchState}
                            getState={getState}
                            version={loadVersion ? loadVersion : state_version}
                        />
                    </Editor>
                </div>
            </StylesProvider>
        </ThemeProvider>
    );
}

function EditorSaveModule({ triggerFetchState, getState, version }) {
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

        getState({
            html: html,
            state: state
        });
    };

    if (triggerFetchState) {
        fetchState();
    }

    return null;
}

export default EmailEditor;
