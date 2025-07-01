import React from "react";
import { Element } from "@craftjs/core";
import {
    Button,
    Container,
    Text,
    Image,
    Video,
    HtmlBox,
    CustomDivider
} from "../components/userComponents";
import { IconButton, makeStyles, Tooltip, Popover } from "@material-ui/core";
import { Box } from "@material-ui/core";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import ImageIcon from "@material-ui/icons/Image";
import CodeIcon from "@material-ui/icons/Code";
import YouTubeIcon from "@material-ui/icons/YouTube";
import Crop75Icon from "@material-ui/icons/Crop75";
import ViewWeekIcon from "@material-ui/icons/ViewWeek";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles(theme => ({
    root: {},
    queryField: {
        width: 500
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(1),
        border: "none"
    },
    fallbackTypography: {
        padding: theme.spacing(1)
    }
}));

type TooltipPlacement = "bottom" | "left" | "right" | "top" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start";

interface ToolboxProps {
    anchorEl?: HTMLElement | null;
    onClick: (val: any) => void;
    origin?: string;
    onClose: () => void;
}

export function Toolbox({ anchorEl, onClick, origin, onClose }: ToolboxProps) {
    const classes = useStyles();
    //   console.log(anchorEl);
    const isDown = origin !== "top";
    
    // Convert origin string to valid placement value
    const getPlacement = (origin?: string): TooltipPlacement => {
        switch (origin) {
            case "top":
                return "top";
            case "bottom":
                return "bottom";
            case "left":
                return "left";
            case "right":
                return "right";
            default:
                return "top";
        }
    };
    
    const placement = getPlacement(origin);
    return (
        <Popover
            open={Boolean(anchorEl)}
            elevation={5}
            // className={classes.popover}
            classes={{
                paper: classes.paper
            }}
            onClose={onClose}
            anchorEl={anchorEl}
            // onClose={() => handleClose(index)}
            anchorOrigin={{
                vertical: placement === "top" ? "top" : "bottom",
                horizontal: "center"
            }}
            transformOrigin={{
                vertical: placement === "top" ? "bottom" : "top",
                horizontal: "center"
            }}
        >
            <Box display="flex">
                {/* <Box mt={1} /> */}
                <Tooltip arrow title="Text" aria-label="text" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: Text, isDown: isDown });
                        }}
                    >
                        <TextFieldsIcon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="Button" aria-label="button" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: Button, isDown: isDown });
                        }}
                    >
                        <Crop75Icon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="Image" aria-label="image" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: Image, isDown: isDown });
                        }}
                    >
                        <ImageIcon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="Video" aria-label="video" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: Video, isDown: isDown });
                        }}
                    >
                        <YouTubeIcon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="Columns" aria-label="container" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: Container, isDown: isDown, isCanvas: true });
                        }}
                    >
                        <ViewWeekIcon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="Divider" aria-label="divider" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: CustomDivider, isDown: isDown });
                        }}
                    >
                        <RemoveIcon />
                    </IconButton>
                </Tooltip>
                <Box mr={1} />
                <Tooltip arrow title="HTML" aria-label="html" placement={placement}>
                    <IconButton
                        onClick={() => {
                            onClick({ newNode: HtmlBox, isDown: isDown });
                        }}
                    >
                        <CodeIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Popover>
    );
}
