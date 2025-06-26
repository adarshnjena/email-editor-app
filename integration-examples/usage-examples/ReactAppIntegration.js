import React, { useState } from 'react';
import EmailEditorComponent from '../react-component/EmailEditorComponent';

/**
 * Example of how to integrate the Email Editor into a React application
 */
function MyApp() {
    const [editorState, setEditorState] = useState(null);
    const [savedEmails, setSavedEmails] = useState([]);

    const handleSave = (editorData) => {
        console.log('Email saved:', editorData);
        setEditorState(editorData);
        
        // Save to your backend or local storage
        const emailData = {
            id: Date.now(),
            html: editorData.html,
            json: editorData.json,
            createdAt: new Date().toISOString()
        };
        
        setSavedEmails(prev => [...prev, emailData]);
    };

    const handlePreview = (html) => {
        console.log('Preview opened:', html);
        // You can show the preview in a modal or new window
    };

    const handleHtmlView = (html) => {
        console.log('HTML view opened:', html);
        // You can copy to clipboard or show in a code editor
    };

    const loadExistingEmail = (emailId) => {
        const email = savedEmails.find(e => e.id === emailId);
        if (email) {
            // Load the email into the editor
            // Note: You'll need to encode the JSON state properly
            setEditorState(email.json);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Email Campaign Tool</h1>
            
            {/* Sidebar with saved emails */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '200px' }}>
                    <h3>Saved Emails</h3>
                    {savedEmails.map(email => (
                        <div 
                            key={email.id} 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #ccc', 
                                marginBottom: '10px',
                                cursor: 'pointer'
                            }}
                            onClick={() => loadExistingEmail(email.id)}
                        >
                            Email {email.id}
                            <br />
                            <small>{new Date(email.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>

                {/* Email Editor */}
                <div style={{ flex: 1 }}>
                    <EmailEditorComponent
                        initialState={editorState}
                        onSave={handleSave}
                        onPreview={handlePreview}
                        onHtmlView={handleHtmlView}
                        height="700px"
                        settings={{
                            // Custom settings if needed
                            theme: 'light',
                            autoSave: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default MyApp;
