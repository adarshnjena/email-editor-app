import React, { useState } from "react";
import { useEditor, useNode } from "@craftjs/core";
import { Box, Grid, Button as MaterialButton, Tooltip } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { ContainerDefaultProps, ContainerSettings } from "./ContainerSettings";
import { Toolbox } from "../../../utils/Toolbox";
import { renderNodeUtils } from "../../../utils/renderNodeUtils";
import AddIcon from "@material-ui/icons/Add";

interface ResizerProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    parentStyle?: React.CSSProperties;
    props?: any;
    craftRef?: (el: HTMLElement | null) => void;
}

interface PopoverAnchor {
    element: HTMLElement;
    position: string;
    targetNode: string;
}

export const Resizer: React.FC<ResizerProps> = ({ children, style, parentStyle, props, craftRef }) => {
    const { id, src } = useNode((node: any) => {
        return { src: node };
    });
    const { query, actions } = useEditor();
    const { addNode } = renderNodeUtils({
        isSelected: true,
        query: query,
        actions: actions,
        src: src
    });
    const [popoverAchorEl, setPopOverAnchorEl] = useState<PopoverAnchor | null>(null);
    return (
        <Grid item ref={craftRef} style={parentStyle} xs={props.xs} id={id}>
            <Grid
                container
                style={{
                    ...style,
                    backgroundImage: "url(" + style.backgroundImage + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}
                alignItems={props.alignItems}
            >
                {children && React.isValidElement(children) && children.props && children.props.children ? (
                    <>{children}</>
                ) : (
                    <Box
                        bgcolor="#f5f5f5"
                        width="100%"
                        minHeight="25vh"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            border: "thin dashed #9e9e9e"
                        }}
                    >
                        <Typography variant="body2">No content present</Typography>
                        <Tooltip title="Add Content" placement="bottom" arrow>
                            <MaterialButton
                                startIcon={<AddIcon />}
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    setPopOverAnchorEl({
                                        element: e.currentTarget,
                                        position: "bottom",
                                        targetNode: src.id
                                    });
                                }}
                                style={{ marginTop: 20 }}
                                color="secondary"
                                size="small"
                                variant="outlined"
                            >
                                Add
                            </MaterialButton>
                        </Tooltip>
                        <Toolbox
                            anchorEl={popoverAchorEl ? popoverAchorEl.element : null}
                            origin={popoverAchorEl ? popoverAchorEl.position : "top"}
                            onClose={() => {
                                setPopOverAnchorEl(null);
                            }}
                            onClick={(val: any) => {
                                addNode({ ...val, trg: popoverAchorEl?.targetNode });
                                setPopOverAnchorEl(null);
                            }}
                        />
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};
(Resizer as any).craft = {
    props: ContainerDefaultProps,
    displayName: "Block",
    related: {
        settings: ContainerSettings
    }
};
