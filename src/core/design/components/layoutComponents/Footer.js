import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Button as MaterialButton, Tooltip } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import CodeIcon from "@material-ui/icons/Code";
import VisibilityIcon from "@material-ui/icons/Visibility";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import { SvgIcon } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1000,
        display: "flex",
        gap: theme.spacing(1)
    },
    buttonGroup: {
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
    },
    button: {
        borderColor: "transparent",
        backgroundColor: "transparent",
        color: "#64748b",
        padding: theme.spacing(1.5, 2),
        minWidth: "auto",
        transition: "all 0.2s ease-in-out",
        '&:hover': {
            backgroundColor: "#f8fafc",
            color: "#3f51b5",
            borderColor: "transparent"
        },
        '&:disabled': {
            opacity: 0.4,
            cursor: "not-allowed"
        },
        '&:not(:last-child)': {
            borderRight: "1px solid #e2e8f0"
        }
    },
    iconButton: {
        fontSize: "20px"
    }
}));

export function Footer({ onPreviewOpen, onHtmlOpen }) {
    const classes = useStyles();
    const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
        enabled: state.options.enabled,
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo()
    }));

    return (
        <div className={classes.root}>
            <ButtonGroup className={classes.buttonGroup} size="medium" disableElevation>
                <Tooltip title="Undo" arrow>
                    <MaterialButton
                        className={classes.button}
                        disabled={!canUndo}
                        onClick={() => {
                            if (canUndo) {
                                actions.history.undo();
                            }
                        }}
                    >
                        <UndoIcon className={classes.iconButton} />
                    </MaterialButton>
                </Tooltip>
                
                <Tooltip title="Redo" arrow>
                    <MaterialButton
                        className={classes.button}
                        disabled={!canRedo}
                        onClick={() => {
                            if (canRedo) {
                                actions.history.redo();
                            }
                        }}
                    >
                        <RedoIcon className={classes.iconButton} />
                    </MaterialButton>
                </Tooltip>
                
                <Tooltip title="Preview Email" arrow>
                    <MaterialButton 
                        className={classes.button}
                        onClick={onPreviewOpen}
                    >
                        <VisibilityIcon className={classes.iconButton} />
                    </MaterialButton>
                </Tooltip>
                
                <Tooltip title="View HTML" arrow>
                    <MaterialButton 
                        className={classes.button}
                        onClick={onHtmlOpen}
                    >
                        <CodeIcon className={classes.iconButton} />
                    </MaterialButton>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
}
