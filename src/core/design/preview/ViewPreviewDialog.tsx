import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    Button,
    Tooltip,
    useTheme,
    List
} from "@material-ui/core";
import LaptopIcon from "@material-ui/icons/Laptop";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import Grid from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import Editor from "../../components/AceEditor";
import Handlebars from "handlebars";
import { HtmlPreview } from "./HtmlPreview";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import { Divider } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import convertHandlebarStringToObject from "../utils/handleBarStringIntoObjects";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: "fixed",
        backgroundColor: "#ffffff"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    formLabel: {
        color: "black"
    },
    toggleContainer: {
        // margin: theme.spacing(0, 0)
    },
    topbar: {
        backgroundColor: theme.palette.grey[800]
    },
    dot: {
        height: "13px",
        width: "13px",
        borderRadius: `50%`,
        display: "inline-block",
        marginRight: 3
    },
    normalBorder: {
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1
    }
}));

interface AlertProps {
    [key: string]: any;
}

function Alert(props: AlertProps): JSX.Element {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface PopulateStateResult {
    data: string;
    template: () => void;
    previewDoc: string;
}

function populateState(previewDoc: string): PopulateStateResult {
    let regEx = /{{[{]?(.*?)[}]?}}/g;
    let tmp = previewDoc ? previewDoc.match(regEx) || [] : [];
    let tmp1: Record<string, string> = {};
    tmp.map(val => {
        tmp1[val.substring(2, val.length - 2)] = "";
    });
    var str = convertHandlebarStringToObject(tmp1);

    return {
        data: str === "{}" ? "{\n\n}" : str,
        template: () => {},
        previewDoc: previewDoc
    };
}

interface ViewPreviewDialogProps {
    previewDoc: string;
    onClose?: () => void;
    title?: string;
}

interface StateType {
    data: string;
    template: (data: any) => string;
    previewDoc: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    props: Record<string, any>;
}

function ViewPreviewDialog({ previewDoc, onClose, title }: ViewPreviewDialogProps): JSX.Element {
    const classes = useStyles();
    const [formats, setFormats] = React.useState<string>("laptop");
    const theme = useTheme();
    const [state, setState] = React.useState<StateType | null>(null);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        props: {}
    });
    const [dataOpen, setDataOpen] = useState<boolean>(false);
    
    useEffect(() => {
        const template = previewDoc ? Handlebars.compile(previewDoc) : () => "";
        var newObj = populateState(previewDoc);
        setState({ data: newObj.data, template: template as (data: any) => string, previewDoc: previewDoc });
    }, [previewDoc]);

    const handleJsonChange = (newValue: any): void => {
        setState({ ...state!, data: newValue });
    };
    
    const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string): void => {
        event.persist();
        if (newFormats) {
            setFormats(newFormats);
        }
    };

    const handleApply = (): void => {
        let f = 0;
        try {
            const data = JSON.parse(state!.data);
            f = 1;
            setState({
                ...state!,
                previewDoc: state!.template(data)
            });
            enqueueSnackbar("Data Applied", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(f ? "Incorrect Handlebars Syntax" : "Invalid JSON Format in Data", {
                variant: "error"
            });
        }
    };

    const handleClose = (): void => {
        setSnackbar({ ...snackbar, open: false, message: "" });
    };
    
    const enqueueSnackbar = (message: string, props: Record<string, any>): void => {
        setSnackbar({
            ...snackbar,
            open: true,
            message: message,
            props: props
        });
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle disableTypography>
                <Box display="flex" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center" flexGrow={1}>
                        <Typography variant="h4" className={classes.title} color="textPrimary">
                            {title ? title : "Preview"}
                        </Typography>
                    </Box>
                    <Box flexGrow={2} display="flex" alignItems="center" justifyContent="center">
                        <ToggleButtonGroup
                            exclusive
                            value={[formats]}
                            onChange={handleFormat}
                            aria-label="previewDevices"
                            size="small"
                        >
                            <ToggleButton value="laptop" aria-label="laptop">
                                <Tooltip title={"Laptop"}>
                                    <LaptopIcon />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="mobile" aria-label="mobile">
                                <Tooltip title={"Mobile"}>
                                    <PhoneAndroidIcon />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="browser" aria-label="browser">
                                <Tooltip title={"Browser"}>
                                    <WebAssetIcon />
                                </Tooltip>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Box mr={1} />
                        <Tooltip title={"Add Dynamic Data"}>
                            <IconButton
                                onClick={() => {
                                    setDataOpen(!dataOpen);
                                }}
                                className={classes.normalBorder}
                                size="small"
                            >
                                <OfflineBoltIcon color={dataOpen ? "primary" : "action"} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box flexGrow={1} />
                    <Box display="flex" alignItems="flexEnd">
                        {onClose && (
                            <IconButton onClick={onClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={1}
                    style={{
                        backgroundColor: theme.palette.grey[800],
                        height: "100%",
                        overflow: "hidden"
                    }}
                    alignItems="stretch"
                >
                    {dataOpen && (
                        <Grid
                            item
                            xs={3}
                            style={{
                                backgroundColor: "white",
                                paddingLeft: 25,
                                paddingRight: 25
                            }}
                        >
                            <Box mb={1} mt={2} display="flex" alignItems="center" width="100%">
                                <OfflineBoltIcon
                                    fontSize="small"
                                    htmlColor={theme.palette.text.secondary}
                                    style={{ marginRight: 5 }}
                                />
                                <Typography variant="body2">Dynamic Data</Typography>
                                <Box flexGrow={1}></Box>
                                <Box mr={1} />
                                <Button
                                    size="small"
                                    onClick={handleApply}
                                    style={{
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    Apply
                                </Button>
                            </Box>
                            <Editor
                                className=""
                                mode="json"
                                isView={false}
                                height="87%"
                                width="100%"
                                isDark={false}
                                defaultValue=""
                                cursorStart={0}
                                value={state?.data || ""}
                                onChange={handleJsonChange}
                                onPaste={() => {}}
                                disableSyntaxCheck={false}
                                onBlur={() => {}}
                                name="json-editor"
                                onLoad={() => {}}
                            />
                        </Grid>
                    )}
                    <Divider orientation="vertical" />
                    <Grid
                        item
                        xs={12}
                        sm
                        container
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            height: "75vh",
                            overflowY: "auto"
                        }}
                    >
                        {state === null || state.previewDoc === null ? (
                            <CircularProgress />
                        ) : (
                            <HtmlPreview 
                                className="" 
                                html={state.previewDoc} 
                                format={formats as "browser" | "mobile" | "laptop"} 
                            />
                        )}
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Alert
                        severity={
                            snackbar["props"]["variant"] ? snackbar["props"]["variant"] : "success"
                        }
                        style={{
                            width: 250
                        }}
                    >
                        {snackbar["message"]}
                    </Alert>
                </Snackbar>
            </DialogContent>
        </Dialog>
    );
}

export default ViewPreviewDialog;
