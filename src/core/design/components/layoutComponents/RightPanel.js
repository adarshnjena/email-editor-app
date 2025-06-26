import React from "react";
import { ROOT_NODE, useEditor } from "@craftjs/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Divider, Paper } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    settings: {
        overflowX: "hidden",
        overflowY: "scroll",
        width: "370px",
        height: "94%",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    titleContainer: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    }
}));

export function RightPanel({ ...rest }) {
    const classes = useStyles();
    const { actions, query, selected, rootNode } = useEditor((state, query) => {
        const currentNodeId = Array.from(state.events.selected)[0];
        let selected;
        if (currentNodeId && state.nodes[currentNodeId]) {
            try {
                const nodeData = query.node(currentNodeId).get();
                if (nodeData && nodeData.data) {
                    const customName = nodeData.data.custom?.displayName;
                    const name = nodeData.data.displayName;
                    selected = {
                        id: currentNodeId,
                        name: customName || name,
                        settings:
                            state.nodes[currentNodeId].related &&
                            state.nodes[currentNodeId].related.settings,
                        isDeletable: query.node(currentNodeId).isDeletable()
                    };
                }
            } catch (error) {
                console.warn('Failed to query node:', currentNodeId, error);
                selected = null;
            }
        }

        return {
            selected: selected,
            rootNode: state.nodes[ROOT_NODE]
        };
    });

    const BodySettings =
        rootNode && rootNode.related && rootNode.related.settings ? (
            React.createElement(rootNode.related.settings)
        ) : (
            <></>
        );
    return (
        <Box pb={2} mt={1}>
            <Box className={classes.titleContainer} ml={2} mt={2}>
                <Typography variant="h6" color="primary">{selected ? selected.name : "Body"} Settings</Typography>
            </Box>
            <Divider />
            <Paper elevation={0} className={classes.settings}>
                {selected && selected.settings ? (
                    React.createElement(selected.settings)
                ) : (
                    <>{BodySettings}</>
                )}
            </Paper>
        </Box>
    );
}
