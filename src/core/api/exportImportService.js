class ExportImportService {
    // Export editor state as JSON file
    exportAsJSON = (editorState, filename = 'email-template') => {
        try {
            const dataStr = JSON.stringify(editorState, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${filename}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
            
            return { success: true, message: 'JSON exported successfully' };
        } catch (error) {
            console.error('Error exporting JSON:', error);
            return { success: false, message: 'Failed to export JSON', error };
        }
    };

    // Export HTML content as file
    exportAsHTML = (htmlContent, filename = 'email-template') => {
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
            
            return { success: true, message: 'HTML exported successfully' };
        } catch (error) {
            console.error('Error exporting HTML:', error);
            return { success: false, message: 'Failed to export HTML', error };
        }
    };

    // Export as email template (HTML with inline styles)
    exportAsEmailTemplate = (htmlContent, filename = 'email-template') => {
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
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
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
            
            return { success: true, message: 'Email template exported successfully' };
        } catch (error) {
            console.error('Error exporting email template:', error);
            return { success: false, message: 'Failed to export email template', error };
        }
    };

    // Import JSON file and parse editor state
    importFromJSON = () => {
        return new Promise((resolve, reject) => {
            try {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (!file) {
                        reject({ success: false, message: 'No file selected' });
                        return;
                    }
                    
                    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                        reject({ success: false, message: 'Please select a valid JSON file' });
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const jsonData = JSON.parse(e.target.result);
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
    validateEditorState = (data) => {
        try {
            // Basic validation for CraftJS state structure
            if (!data || typeof data !== 'object') {
                return { valid: false, message: 'Invalid data format' };
            }
            
            // Check if it's an encoded state or raw JSON
            if (typeof data === 'string') {
                return { valid: true, isEncoded: true };
            }
            
            // Check for CraftJS state structure
            if (data.json && typeof data.json === 'object') {
                return { valid: true, isEncoded: false };
            }
            
            // Check if it's raw CraftJS nodes
            if (data.ROOT && typeof data.ROOT === 'object') {
                return { valid: true, isEncoded: false, isRawNodes: true };
            }
            
            return { valid: false, message: 'Unrecognized editor state format' };
        } catch (error) {
            return { valid: false, message: 'Error validating state', error };
        }
    };

    // Generate filename with timestamp
    generateFilename = (prefix = 'email-template') => {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
        return `${prefix}-${timestamp}`;
    };
}

const exportImportService = new ExportImportService();

export default exportImportService; 