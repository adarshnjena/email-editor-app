// Export editor state as JSON file
const exportAsJSON = (editorState, filename = 'email-template') => {
    return new Promise((resolve, reject) => {
        try {
            // Debug: Log what we received
            console.log('Export function received:', typeof editorState, editorState);
            
            // Handle different editor state formats
            let exportData;
            if (editorState && editorState.json) {
                // If we have a structured state with json property
                if (typeof editorState.json === 'string') {
                    try {
                        // Json is already a string, parse it to create clean export
                        exportData = {
                            json: JSON.parse(editorState.json),
                            version: editorState.version || '1.0.0'
                        };
                    } catch (parseError) {
                        console.error('Error parsing JSON string:', parseError);
                        // If parsing fails, export the raw structure
                        exportData = editorState;
                    }
                } else {
                    // Json is already an object
                    exportData = editorState;
                }
            } else if (editorState) {
                // If editorState is the raw data
                exportData = editorState;
            } else {
                throw new Error('No editor state provided for export');
            }
            
            const dataStr = JSON.stringify(exportData, null, 2);
            
            // Debug: Log the data being exported
            console.log('Exporting editor state:', exportData);
            console.log('Serialized JSON length:', dataStr.length);
            
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${filename}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
            
            resolve({ success: true, message: 'JSON exported successfully' });
        } catch (error) {
            console.error('Error exporting JSON:', error);
            reject({ success: false, message: 'Failed to export JSON', error });
        }
    });
};

// Export HTML content as file
const exportAsHTML = (htmlContent, filename = 'email-template') => {
    return new Promise((resolve, reject) => {
        try {
            if (!htmlContent) {
                throw new Error('No HTML content provided');
            }
            
            const dataStr = htmlContent;
            const dataUri = 'data:text/html;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${filename}.html`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
            
            resolve({ success: true, message: 'HTML exported successfully' });
        } catch (error) {
            console.error('Error exporting HTML:', error);
            reject({ success: false, message: 'Failed to export HTML', error });
        }
    });
};

// Export as email template (HTML with inline styles)
const exportAsEmailTemplate = (htmlContent, filename = 'email-template') => {
    return new Promise((resolve, reject) => {
        try {
            if (!htmlContent) {
                throw new Error('No HTML content provided');
            }
            
            // Wrap HTML content in a complete email template structure
            const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Template</title>
    <style>
        /* Email client compatibility styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
        }
    </style>
</head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    ${htmlContent}
</body>
</html>`;
            
            const dataUri = 'data:text/html;charset=utf-8,'+ encodeURIComponent(emailTemplate);
            const exportFileDefaultName = `${filename}-email-template.html`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
            
            resolve({ success: true, message: 'Email template exported successfully' });
        } catch (error) {
            console.error('Error exporting email template:', error);
            reject({ success: false, message: 'Failed to export email template', error });
        }
    });
};

// Import JSON file and parse editor state
const importFromJSON = () => {
    return new Promise((resolve, reject) => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (event: Event) => {
                const target = event.target as HTMLInputElement;
                const file = target.files?.[0];
                if (!file) {
                    reject({ success: false, message: 'No file selected' });
                    return;
                }
                
                if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                    reject({ success: false, message: 'Please select a valid JSON file' });
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    try {
                        const result = e.target?.result;
                        if (typeof result !== 'string') {
                            reject({ success: false, message: 'Failed to read file as text' });
                            return;
                        }
                        const jsonData = JSON.parse(result);
                        resolve({ 
                            success: true, 
                            data: jsonData, 
                            filename: file.name,
                            message: 'JSON imported successfully' 
                        });
                    } catch (parseError) {
                        reject({ 
                            success: false, 
                            message: 'Invalid JSON file format', 
                            error: parseError 
                        });
                    }
                };
                
                reader.onerror = () => {
                    reject({ 
                        success: false, 
                        message: 'Error reading file', 
                        error: reader.error 
                    });
                };
                
                reader.readAsText(file);
            };
            
            input.click();
            input.remove();
        } catch (error) {
            reject({ success: false, message: 'Failed to initiate file import', error });
        }
    });
};

// Validate imported editor state
const validateEditorState = (data) => {
    try {
        // Basic validation for CraftJS state structure
        if (!data || typeof data !== 'object') {
            return { valid: false, message: 'Invalid data format' };
        }
        
        // Check if it's an encoded state or raw JSON
        if (typeof data === 'string') {
            return { valid: true, isEncoded: true };
        }
        
        // Check for our export format (json + version)
        if (data.json && data.version) {
            if (typeof data.json === 'object' && data.json.ROOT) {
                return { valid: true, isEncoded: false, format: 'export' };
            }
        }
        
        // Check for CraftJS state structure
        if (data.json && typeof data.json === 'object') {
            return { valid: true, isEncoded: false, format: 'craftjs' };
        }
        
        // Check if it's raw CraftJS nodes
        if (data.ROOT && typeof data.ROOT === 'object') {
            return { valid: true, isEncoded: false, isRawNodes: true, format: 'raw' };
        }
        
        return { valid: false, message: 'Unrecognized editor state format' };
    } catch (error) {
        return { valid: false, message: 'Error validating state', error };
    }
};

// Generate filename with timestamp
const generateFilename = (prefix = 'email-template') => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}`;
};

const exportImportService = {
    exportAsJSON,
    exportAsHTML,
    exportAsEmailTemplate,
    importFromJSON,
    validateEditorState,
    generateFilename
};

export default exportImportService; 
