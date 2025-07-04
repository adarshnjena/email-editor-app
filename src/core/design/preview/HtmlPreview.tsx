import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import { Box, useTheme } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: "fixed",
        backgroundColor: "white"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    formLabel: {
        color: "black"
    },
    toggleContainer: {
        margin: theme.spacing(0, 0)
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
    }
}));

interface TransitionProps {
    children?: React.ReactElement;
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface LaptopProps {
    children: React.ReactNode;
}

function Laptop({ children }: LaptopProps): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <Box
            display="flex"
            flexDirection="column"
            style={{
                borderRadius: "4px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme.palette.text.secondary + "88"
            }}
            alignContent="stretch"
            width="98%"
            height="70vh"
        >
            <Box
                display="flex"
                style={{
                    backgroundColor: theme.palette.grey[800],
                    borderRadius: "4px"
                }}
                alignItems="center"
                height="5%"
                p={1}
            >
                <span className={classes.dot} style={{ backgroundColor: "#757575" }}></span>
                <span className={classes.dot} style={{ backgroundColor: "#bdbdbd" }}></span>
                <span className={classes.dot} style={{ backgroundColor: "#9e9e9e" }}></span>
            </Box>
            <Box
                height="95%"
                style={{
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                    backgroundColor: "#ffffff"
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

interface HtmlPreviewProps {
    className?: string;
    html: string;
    format: "browser" | "mobile" | "laptop";
    [key: string]: any;
}

export function HtmlPreview({ className, html, format, ...rest }: HtmlPreviewProps): JSX.Element {
    return (
        <>
            {format !== "browser" && (
                <>
                    {format === "mobile" && (
                        <div className="marvel-device iphone-x">
                            <div className="notch">
                                <div className="camera"></div>
                                <div className="speaker"></div>
                            </div>
                            <div className="top-bar"></div>
                            <div className="sleep"></div>
                            <div className="bottom-bar"></div>
                            <div className="volume"></div>
                            <div className="overflow">
                                <div className="shadow shadow--tr"></div>
                                <div className="shadow shadow--tl"></div>
                                <div className="shadow shadow--br"></div>
                                <div className="shadow shadow--bl"></div>
                            </div>
                            <div className="inner-shadow"></div>
                            <div className="screen">
                                <iframe
                                    frameBorder={0}
                                    srcDoc={html}
                                    width="100%"
                                    height="100%"
                                    style={{ marginTop: 20 }}
                                />
                            </div>
                        </div>
                    )}
                    {format === "laptop" && (
                        <Laptop>
                            <iframe frameBorder={0} srcDoc={html} width="100%" height="100%" />
                        </Laptop>
                    )}
                </>
            )}
            {format === "browser" && (
                <iframe frameBorder={0} srcDoc={html} width="100%" height="100%" />
            )}
        </>
    );
}
