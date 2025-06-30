import React, { useState } from "react";
import { ROOT_NODE, useEditor, Element } from "@craftjs/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Divider, Paper, Tabs, Tab } from "@material-ui/core";
import {
    Button,
    Container,
    Text,
    Image,
    Video,
    HtmlBox,
    CustomDivider
} from "../userComponents";
import { 
    TextFields,
    Image as ImageIcon,
    Code,
    YouTube,
    Crop75,
    ViewWeek,
    Remove,
    AddBox,
    Palette
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    rightPanel: {
        width: "380px",
        height: "100vh",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    },
    header: {
        padding: theme.spacing(2, 3),
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc"
    },
    tabsContainer: {
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff"
    },
    tab: {
        textTransform: "none",
        fontWeight: 600,
        fontSize: "14px",
        minWidth: "50%",
        '&.Mui-selected': {
            color: "#3f51b5"
        }
    },
    contentArea: {
        flex: 1,
        overflowY: "auto",
        padding: theme.spacing(0),
        backgroundColor: "#ffffff",
        maxHeight: "calc(100vh - 140px)"
    },
    settingsSection: {
        padding: theme.spacing(2, 3),
        paddingBottom: theme.spacing(4)
    },
    sectionTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#1a202c",
        marginBottom: theme.spacing(2),
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    componentGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    componentButton: {
        padding: theme.spacing(2),
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(1),
        '&:hover': {
            borderColor: "#3f51b5",
            backgroundColor: "#f7faff",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }
    },
    componentIcon: {
        fontSize: "24px",
        color: "#4a5568"
    },
    componentLabel: {
        fontSize: "12px",
        fontWeight: 500,
        color: "#4a5568",
        textAlign: "center"
    },
    indicator: {
        backgroundColor: "#3f51b5"
    }
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`panel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function ContentTab({ onAddComponent }) {
    const classes = useStyles();
    const { connectors } = useEditor();

    const buildElement = React.useCallback(comp => {
        if (comp.isCanvas) {
            return (
                <Element canvas is={comp.component} custom={{ displayName: comp.name }} />
            );
        }
        return React.createElement(comp.component);
    }, []);

    const PaletteItem = ({ comp }) => {
        const element = React.useMemo(() => buildElement(comp), [buildElement, comp]);
        
        const IconComponent = comp.icon;
        return (
            <div
                ref={dom => dom && connectors.create(dom, element)}
                className={classes.componentButton}
            >
                <IconComponent className={classes.componentIcon} />
                <Typography className={classes.componentLabel}>{comp.name}</Typography>
            </div>
        );
    };
    
    const components = [
        { name: "Text", icon: TextFields, component: Text },
        { name: "Button", icon: Crop75, component: Button },
        { name: "Image", icon: ImageIcon, component: Image },
        { name: "Video", icon: YouTube, component: Video },
        {
            name: "Columns",
            icon: ViewWeek,
            component: Container,
            isCanvas: true
        },
        { name: "Divider", icon: Remove, component: CustomDivider },
        { name: "HTML", icon: Code, component: HtmlBox }
    ];

    return (
        <div className={classes.contentArea}>
            <div className={classes.settingsSection}>
                <Typography className={classes.sectionTitle}>Add Components</Typography>
                <div className={classes.componentGrid}>
                    {components.map((comp, index) => (
                        <PaletteItem key={index} comp={comp} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function RightPanel({ ...rest }) {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddComponent = ({ newNode, isCanvas = false }) => {
        console.log('Adding component:', newNode.displayName || newNode.name);
    };

    const BodySettings =
        rootNode && rootNode.related && rootNode.related.settings ? (
            React.createElement(rootNode.related.settings)
        ) : (
            <></>
        );

    return (
        <div className={classes.rightPanel}>
            <div className={classes.header}>
                <Typography variant="h6" style={{ fontSize: "16px", fontWeight: 600, color: "#1a202c" }}>
                    {selected ? `${selected.name} Settings` : "Email Editor"}
                </Typography>
                {selected && (
                    <Typography variant="body2" style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        Customize your {selected.name.toLowerCase()} component
                    </Typography>
                )}
            </div>

            <div className={classes.tabsContainer}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    classes={{ indicator: classes.indicator }}
                >
                    <Tab 
                        label="Content" 
                        className={classes.tab}
                        icon={<AddBox style={{ fontSize: "18px" }} />}
                        iconPosition="start"
                    />
                    <Tab 
                        label="Style" 
                        className={classes.tab}
                        icon={<Palette style={{ fontSize: "18px" }} />}
                        iconPosition="start"
                    />
                </Tabs>
            </div>

            <TabPanel value={tabValue} index={0}>
                <ContentTab onAddComponent={handleAddComponent} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <div className={classes.contentArea}>
                    <div className={classes.settingsSection}>
                {selected && selected.settings ? (
                    React.createElement(selected.settings)
                ) : (
                    <>{BodySettings}</>
                )}
                    </div>
                </div>
            </TabPanel>
        </div>
    );
}
