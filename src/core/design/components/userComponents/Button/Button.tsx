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
        background: "linear-gradient(135deg, #757575 0%, #424242 100%)",
        color: "#ffffff",
        '&:hover': {
            background: "linear-gradient(135deg, #616161 0%, #212121 100%)"
        }
    },
    secondaryButton: {
        backgroundColor: "#ffffff",
        color: "#424242",
        border: "2px solid #e0e0e0",
        '&:hover': {
            backgroundColor: "#fafafa",
            borderColor: "#bdbdbd"
        }
    },
    outlinedButton: {
        backgroundColor: "transparent",
        color: "#424242",
        border: "2px solid #424242",
        '&:hover': {
            backgroundColor: "#424242",
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
