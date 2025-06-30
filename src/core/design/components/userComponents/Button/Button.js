import { useNode } from "@craftjs/core";
import React from "react";
import { ButtonDefaultProps, ButtonSettings } from "./ButtonSettings";
import { Button as MaterialButton, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    modernButton: {
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        textTransform: "none",
        padding: theme.spacing(1.5, 3),
        transition: "all 0.2s ease-in-out",
        boxShadow: "none",
        '&:hover': {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        },
        '&:active': {
            transform: "translateY(0px)"
        }
    },
    primaryButton: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
        '&:hover': {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
        }
    },
    secondaryButton: {
        backgroundColor: "#ffffff",
        color: "#4a5568",
        border: "2px solid #e2e8f0",
        '&:hover': {
            backgroundColor: "#f8fafc",
            borderColor: "#cbd5e0"
        }
    },
    outlinedButton: {
        backgroundColor: "transparent",
        color: "#3f51b5",
        border: "2px solid #3f51b5",
        '&:hover': {
            backgroundColor: "#3f51b5",
            color: "#ffffff"
        }
    }
}));

//setting border to null if border-width is 0
function getBorderStyles(style) {
    var borderStyles = {
        borderTop: style.borderTop != null && style.borderTop[0] === "0" ? null : style.borderTop,
        borderBottom:
            style.borderBottom != null && style.borderBottom[0] === "0" ? null : style.borderBottom,
        borderLeft:
            style.borderLeft != null && style.borderLeft[0] === "0" ? null : style.borderLeft,
        borderRight:
            style.borderRight != null && style.borderRight[0] === "0" ? null : style.borderRight
    };
    return borderStyles;
}

export const Button = ({ props, parentStyle, style, ...rest }) => {
    const classes = useStyles();
    const {
        connectors: { connect, drag },
        id
    } = useNode();
    
    //bgimage/bgcolor
    var parentStyleCopy = { ...parentStyle };
    if (parentStyleCopy.backgroundImage !== "") {
        parentStyleCopy.backgroundImage = "url(" + parentStyleCopy.backgroundImage + ")";
    }

    // Determine button variant class
    const getButtonClass = () => {
        switch(style.variant) {
            case 'contained':
                return `${classes.modernButton} ${classes.primaryButton}`;
            case 'outlined':
                return `${classes.modernButton} ${classes.outlinedButton}`;
            default:
                return `${classes.modernButton} ${classes.secondaryButton}`;
        }
    };

    return (
        <Grid
            item
            id={id}
            xs={12}
            ref={connect}
            style={Object.assign(
                {
                    textAlign: parentStyleCopy.align || "center",
                    padding: "16px 0"
                },
                parentStyleCopy
            )}
        >
            <div className={classes.buttonContainer}>
                <MaterialButton
                    href={props.path}
                    target="_blank"
                    size={style.size || "medium"}
                    variant={style.variant || "contained"}
                    className={getButtonClass()}
                    style={{
                        ...style,
                        ...getBorderStyles(style),
                        display: "inline-block",
                        minWidth: "120px"
                    }}
                >
                    {props.text}
                </MaterialButton>
            </div>
        </Grid>
    );
};

Button.craft = {
    props: ButtonDefaultProps,
    related: {
        settings: ButtonSettings
    },
    displayName: "Button",
    rules: {
        canMoveIn: () => false
    }
};
