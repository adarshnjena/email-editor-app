import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Button,
    Box,
    Grid,
    Divider,
    CircularProgress,
    Paper
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import CodeIcon from "@material-ui/icons/Code";
import EmailIcon from "@material-ui/icons/Email";
import DescriptionIcon from "@material-ui/icons/Description";
import exportImportService from "../../../api/exportImportService";

const useStyles = makeStyles(theme => ({
    dialog: {
        "& .MuiDialog-paper": {
            borderRadius: 16,
            minWidth: 500,
            maxWidth: 600
        }
    },
    dialogTitle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(2, 3),
        borderBottom: "1px solid #e2e8f0"
    },
    title: {
        fontWeight: 600,
        color: "#1a202c"
    },
    closeButton: {
        color: "#64748b"
    },
    content: {
        padding: theme.spacing(3)
    },
    section: {
        marginBottom: theme.spacing(3)
    },
    sectionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        color: "#374151"
    },
    actionCard: {
        padding: theme.spacing(2),
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        "&:hover": {
            borderColor: "#3f51b5",
            boxShadow: "0 4px 12px rgba(63, 81, 181, 0.15)"
        }
    },
    actionIcon: {
        fontSize: 24,
        color: "#3f51b5",
        marginBottom: theme.spacing(1)
    },
    actionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5)
    },
    actionDescription: {
        color: "#64748b",
        fontSize: 14
    },
    importArea: {
        border: "2px dashed #cbd5e0",
        borderRadius: 12,
        padding: theme.spacing(3),
        textAlign: "center",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        "&:hover": {
            borderColor: "#3f51b5",
            backgroundColor: "#f8fafc"
        }
    },
    loadingContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(2)
    }
}));

export function ExportImportDialog({ 
    open, 
    onClose, 
    editorState, 
    htmlContent, 
    onImportSuccess 
}) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleExportJSON = async () => {
        try {
            setLoading(true);
            const filename = exportImportService.generateFilename('email-template');
            await exportImportService.exportAsJSON(editorState, filename);
            setMessage({ type: 'success', text: 'Template exported as JSON successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Failed to export JSON: ' + (error?.message || error) });
        } finally {
            setLoading(false);
        }
    };

    const handleExportHTML = async () => {
        try {
            setLoading(true);
            if (!htmlContent) {
                throw new Error('No HTML content available. Please generate preview first.');
            }
            const filename = exportImportService.generateFilename('email-template');
            await exportImportService.exportAsHTML(htmlContent, filename);
            setMessage({ type: 'success', text: 'HTML exported successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Failed to export HTML: ' + (error?.message || error) });
        } finally {
            setLoading(false);
        }
    };

    const handleExportEmailTemplate = async () => {
        try {
            setLoading(true);
            if (!htmlContent) {
                throw new Error('No HTML content available. Please generate preview first.');
            }
            const filename = exportImportService.generateFilename('email-template');
            await exportImportService.exportAsEmailTemplate(htmlContent, filename);
            setMessage({ type: 'success', text: 'Email template exported successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Failed to export email template: ' + (error?.message || error) });
        } finally {
            setLoading(false);
        }
    };

    const handleImportJSON = async () => {
        try {
            setLoading(true);
            const result: any = await exportImportService.importFromJSON();
            
            if (result.success) {
                const validation = exportImportService.validateEditorState(result.data);
                
                if (validation.valid) {
                    onImportSuccess(result.data);
                    setMessage({ type: 'success', text: `Template imported successfully from ${result.filename}!` });
                    setTimeout(() => {
                        onClose();
                    }, 1500);
                } else {
                    setMessage({ type: 'error', text: validation.message });
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error?.message || 'Failed to import file' });
        } finally {
            setLoading(false);
        }
    };

    const clearMessage = () => {
        setMessage(null);
    };

    return (
        <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="md">
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant="h6" className={classes.title}>
                    Export & Import Templates
                </Typography>
                <IconButton className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent className={classes.content}>
                {message && (
                    <Box className={classes.section}>
                        <Alert 
                            severity={message.type} 
                            onClose={clearMessage}
                            style={{ marginBottom: 16 }}
                        >
                            {message.text}
                        </Alert>
                    </Box>
                )}

                {loading && (
                    <Box className={classes.loadingContainer}>
                        <CircularProgress size={24} style={{ marginRight: 16 }} />
                        <Typography>Processing...</Typography>
                    </Box>
                )}

                {/* Export Section */}
                <Box className={classes.section}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        <GetAppIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Export Template
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                className={classes.actionCard}
                                onClick={loading ? undefined : handleExportJSON}
                            >
                                <DescriptionIcon className={classes.actionIcon} />
                                <Typography variant="subtitle2" className={classes.actionTitle}>
                                    Export as JSON
                                </Typography>
                                <Typography className={classes.actionDescription}>
                                    Save template data for editing later
                                </Typography>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                className={classes.actionCard}
                                onClick={loading ? undefined : handleExportHTML}
                            >
                                <CodeIcon className={classes.actionIcon} />
                                <Typography variant="subtitle2" className={classes.actionTitle}>
                                    Export as HTML
                                </Typography>
                                <Typography className={classes.actionDescription}>
                                    Get clean HTML for web use
                                </Typography>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Paper 
                                className={classes.actionCard}
                                onClick={loading ? undefined : handleExportEmailTemplate}
                            >
                                <EmailIcon className={classes.actionIcon} />
                                <Typography variant="subtitle2" className={classes.actionTitle}>
                                    Email Template
                                </Typography>
                                <Typography className={classes.actionDescription}>
                                    Email-ready HTML with compatibility
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                {/* Import Section */}
                <Box className={classes.section}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        <PublishIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Import Template
                    </Typography>
                    
                    <Paper 
                        className={classes.importArea}
                        onClick={loading ? undefined : handleImportJSON}
                    >
                        <PublishIcon style={{ fontSize: 48, color: "#64748b", marginBottom: 16 }} />
                        <Typography variant="h6" style={{ marginBottom: 8 }}>
                            Import JSON Template
                        </Typography>
                        <Typography className={classes.actionDescription}>
                            Click to select a JSON template file to import
                        </Typography>
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default ExportImportDialog; 
