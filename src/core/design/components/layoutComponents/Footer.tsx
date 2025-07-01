import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Button as MaterialButton, Tooltip, useMediaQuery, useTheme, Backdrop } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import CodeIcon from "@material-ui/icons/Code";
import VisibilityIcon from "@material-ui/icons/Visibility";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { SvgIcon } from "@material-ui/core";
import ExportImportDialog from "./ExportImportDialog";

const useStyles = makeStyles(theme => ({
    root: {
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1000,
        display: "flex",
        gap: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            bottom: 16,
            left: 16,
            right: 16,
            transform: "none",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: theme.spacing(1)
        }
    },
    buttonGroup: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        '&:hover': {
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)"
        },
        [theme.breakpoints.down('sm')]: {
            borderRadius: "12px"
        }
    },
    historyGroup: {
        background: "linear-gradient(135deg, rgba(117, 117, 117, 0.1) 0%, rgba(66, 66, 66, 0.1) 100%)",
        '&:hover': {
            background: "linear-gradient(135deg, rgba(117, 117, 117, 0.15) 0%, rgba(66, 66, 66, 0.15) 100%)"
        }
    },
    actionGroup: {
        background: "linear-gradient(135deg, rgba(117, 117, 117, 0.1) 0%, rgba(97, 97, 97, 0.1) 100%)",
        '&:hover': {
            background: "linear-gradient(135deg, rgba(117, 117, 117, 0.15) 0%, rgba(97, 97, 97, 0.15) 100%)"
        }
    },
    button: {
        borderColor: "transparent",
        backgroundColor: "transparent",
        color: "#757575",
        padding: theme.spacing(1.5, 2.5),
        minWidth: 48,
        height: 48,
        borderRadius: "12px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        '&:hover': {
            backgroundColor: "rgba(66, 66, 66, 0.08)",
            color: "#424242",
            borderColor: "transparent",
            transform: "scale(1.05)",
            '&::before': {
                opacity: 1
            }
        },
        '&:active': {
            transform: "scale(0.98)"
        },
        '&:disabled': {
            opacity: 0.3,
            cursor: "not-allowed",
            transform: "none"
        },
        '&:not(:last-child)': {
            borderRight: "1px solid rgba(224, 224, 224, 0.5)"
        },
        '&::before': {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(66, 66, 66, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%)",
            opacity: 0,
            transition: "opacity 0.3s ease"
        },
        '&:focus': {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(66, 66, 66, 0.2)",
            backgroundColor: "rgba(66, 66, 66, 0.05)"
        },
        [theme.breakpoints.down('sm')]: {
            minWidth: 44,
            height: 44,
            padding: theme.spacing(1.25, 2)
        }
    },
    iconButton: {
        fontSize: "20px",
        position: "relative",
        zIndex: 1,
        transition: "all 0.3s ease",
        [theme.breakpoints.down('sm')]: {
            fontSize: "18px"
        }
    },
    keyboardShortcut: {
        fontSize: "11px",
        opacity: 0.7,
        marginTop: "2px",
        display: "block",
        color: "#94a3b8"
    },
    pulseAnimation: {
        animation: "$pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    },
    "@keyframes pulse": {
        "0%, 100%": {
            opacity: 1
        },
        "50%": {
            opacity: 0.7
        }
    },
    fabContainer: {
        position: "relative"
    },
    backdrop: {
        zIndex: 1200,
        color: '#fff'
    }
}));

export function Footer({ onPreviewOpen, onHtmlOpen, editorState, htmlContent, onImportSuccess }) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [exportImportOpen, setExportImportOpen] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    
    const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
        enabled: state.options.enabled,
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo()
    }));

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        if (e.shiftKey && canRedo) {
                            e.preventDefault();
                            actions.history.redo();
                            setActiveAction('redo');
                            setTimeout(() => setActiveAction(null), 200);
                        } else if (canUndo) {
                            e.preventDefault();
                            actions.history.undo();
                            setActiveAction('undo');
                            setTimeout(() => setActiveAction(null), 200);
                        }
                        break;
                    case 'p':
                        e.preventDefault();
                        onPreviewOpen();
                        setActiveAction('preview');
                        setTimeout(() => setActiveAction(null), 200);
                        break;
                    case 'h':
                        e.preventDefault();
                        onHtmlOpen();
                        setActiveAction('html');
                        setTimeout(() => setActiveAction(null), 200);
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, actions, onPreviewOpen, onHtmlOpen]);

    const tooltipProps = {
        arrow: true,
        enterDelay: 500,
        placement: "top" as const
    };

    return (
        <>
            <div className={classes.root}>
                {/* History Actions Group */}
                <ButtonGroup 
                    className={`${classes.buttonGroup} ${classes.historyGroup}`} 
                    size="medium" 
                    disableElevation
                >
                    <Tooltip 
                        title={
                            <div>
                                Undo
                                <span className={classes.keyboardShortcut}>Ctrl+Z</span>
                            </div>
                        } 
                        {...tooltipProps}
                    >
                        <MaterialButton
                            className={`${classes.button} ${activeAction === 'undo' ? classes.pulseAnimation : ''}`}
                            disabled={!canUndo}
                            onClick={() => {
                                if (canUndo) {
                                    actions.history.undo();
                                    setActiveAction('undo');
                                    setTimeout(() => setActiveAction(null), 200);
                                }
                            }}
                            aria-label="Undo last action"
                        >
                            <UndoIcon className={classes.iconButton} />
                        </MaterialButton>
                    </Tooltip>
                    
                    <Tooltip 
                        title={
                            <div>
                                Redo
                                <span className={classes.keyboardShortcut}>Ctrl+Shift+Z</span>
                            </div>
                        } 
                        {...tooltipProps}
                    >
                        <MaterialButton
                            className={`${classes.button} ${activeAction === 'redo' ? classes.pulseAnimation : ''}`}
                            disabled={!canRedo}
                            onClick={() => {
                                if (canRedo) {
                                    actions.history.redo();
                                    setActiveAction('redo');
                                    setTimeout(() => setActiveAction(null), 200);
                                }
                            }}
                            aria-label="Redo last action"
                        >
                            <RedoIcon className={classes.iconButton} />
                        </MaterialButton>
                    </Tooltip>
                </ButtonGroup>

                {/* Main Actions Group */}
                <ButtonGroup 
                    className={`${classes.buttonGroup} ${classes.actionGroup}`} 
                    size="medium" 
                    disableElevation
                >
                    <Tooltip 
                        title={
                            <div>
                                Preview Email
                                <span className={classes.keyboardShortcut}>Ctrl+P</span>
                            </div>
                        } 
                        {...tooltipProps}
                    >
                        <MaterialButton 
                            className={`${classes.button} ${activeAction === 'preview' ? classes.pulseAnimation : ''}`}
                            onClick={() => {
                                onPreviewOpen();
                                setActiveAction('preview');
                                setTimeout(() => setActiveAction(null), 200);
                            }}
                            aria-label="Preview email in new window"
                        >
                            <VisibilityIcon className={classes.iconButton} />
                        </MaterialButton>
                    </Tooltip>
                    
                    <Tooltip 
                        title={
                            <div>
                                View HTML Code
                                <span className={classes.keyboardShortcut}>Ctrl+H</span>
                            </div>
                        } 
                        {...tooltipProps}
                    >
                        <MaterialButton 
                            className={`${classes.button} ${activeAction === 'html' ? classes.pulseAnimation : ''}`}
                            onClick={() => {
                                onHtmlOpen();
                                setActiveAction('html');
                                setTimeout(() => setActiveAction(null), 200);
                            }}
                            aria-label="View HTML source code"
                        >
                            <CodeIcon className={classes.iconButton} />
                        </MaterialButton>
                    </Tooltip>
                    
                    <Tooltip 
                        title={
                            <div>
                                Export & Import
                                <span className={classes.keyboardShortcut}>Save & Load Templates</span>
                            </div>
                        } 
                        {...tooltipProps}
                    >
                        <MaterialButton 
                            className={classes.button}
                            onClick={() => setExportImportOpen(true)}
                            aria-label="Export current template or import existing template"
                        >
                            <SaveAltIcon className={classes.iconButton} />
                        </MaterialButton>
                    </Tooltip>
                </ButtonGroup>
            </div>
            
            <ExportImportDialog
                open={exportImportOpen}
                onClose={() => setExportImportOpen(false)}
                editorState={editorState}
                htmlContent={htmlContent}
                onImportSuccess={onImportSuccess}
            />
        </>
    );
}
