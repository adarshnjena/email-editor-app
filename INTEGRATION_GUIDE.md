# Email Editor Integration Guide

This guide explains how to integrate the Email Editor into other applications.

## Integration Options

### 1. iframe Integration (Recommended for Cross-Framework)

The email editor supports iframe embedding with postMessage communication.

#### Basic Setup
```html
<iframe 
    id="email-editor" 
    src="http://localhost:3000" 
    width="100%" 
    height="600px"
    frameborder="0">
</iframe>
```

#### JavaScript Communication
```javascript
const iframe = document.getElementById('email-editor');

// Load editor with existing data
function loadEditor(encodedState) {
    iframe.contentWindow.postMessage({
        message: "loadEditor",
        value: encodedState
    }, "*");
}

// Get current editor state
function saveEditor() {
    iframe.contentWindow.postMessage({
        message: "fetchState"
    }, "*");
}

// Listen for editor responses
window.addEventListener("message", (event) => {
    switch(event.data.message) {
        case "editorLoaded":
            console.log("Editor is ready");
            break;
        case "savedState":
            const editorData = event.data.value;
            // Save editorData.json and editorData.html
            console.log("Editor state saved:", editorData);
            break;
    }
});
```

### 2. React Component Integration

For React applications, use the provided reusable component.

#### Installation
1. Copy the `EmailEditorComponent.js` from `/integration-examples/react-component/`
2. Install required dependencies from `package.json`
3. Import and use the component

#### Basic Usage
```jsx
import EmailEditorComponent from './path/to/EmailEditorComponent';

function MyApp() {
    const [editorState, setEditorState] = useState(null);

    const handleSave = (editorData) => {
        console.log('Saved:', editorData);
        // Save editorData.json and editorData.html to your backend
    };

    return (
        <EmailEditorComponent
            initialState={editorState}
            onSave={handleSave}
            height="700px"
        />
    );
}
```

### 3. NPM Package (Future Enhancement)

To create a distributable package:

1. **Create package structure:**
```
email-editor-package/
├── src/
│   ├── index.js (export EmailEditorComponent)
│   └── ... (core editor files)
├── package.json
└── README.md
```

2. **Update package.json:**
```json
{
  "name": "@yourorg/email-editor",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

## Data Flow

### Editor State Structure
```javascript
{
    json: {}, // Craft.js serialized state
    html: "", // Generated HTML email
    version: "1.0.0" // State version for compatibility
}
```

### State Encoding/Decoding
The editor uses encrypted JSON for state persistence:
- Use `encodeJson()` to prepare state for storage
- Use `decodeJson()` to load state into editor

## Integration Examples

### WordPress Plugin
```php
// wp-content/plugins/email-editor/email-editor.php
function email_editor_shortcode($atts) {
    $iframe_url = 'http://localhost:3000';
    return '<iframe src="' . $iframe_url . '" width="100%" height="600px"></iframe>';
}
add_shortcode('email_editor', 'email_editor_shortcode');
```

### Vue.js Integration
```vue
<template>
  <iframe 
    ref="editorFrame"
    :src="editorUrl" 
    width="100%" 
    height="600px"
    @load="setupCommunication"
  ></iframe>
</template>

<script>
export default {
  data() {
    return {
      editorUrl: 'http://localhost:3000'
    }
  },
  methods: {
    setupCommunication() {
      window.addEventListener('message', this.handleMessage);
    },
    handleMessage(event) {
      if (event.data.message === 'savedState') {
        this.$emit('save', event.data.value);
      }
    }
  }
}
</script>
```

### Angular Integration
```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-email-editor',
  template: `
    <iframe #editorFrame 
            src="http://localhost:3000" 
            width="100%" 
            height="600px">
    </iframe>
  `
})
export class EmailEditorComponent {
  @ViewChild('editorFrame') editorFrame!: ElementRef;

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data.message === 'savedState') {
        this.onSave(event.data.value);
      }
    });
  }

  saveEditor() {
    this.editorFrame.nativeElement.contentWindow.postMessage({
      message: 'fetchState'
    }, '*');
  }

  onSave(data: any) {
    // Handle saved data
    console.log('Editor saved:', data);
  }
}
```

## Deployment Considerations

### 1. Cross-Origin Setup
Ensure proper CORS headers when hosting the editor:
```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### 2. Security
- Validate message origins in postMessage handlers
- Sanitize HTML output before rendering
- Use HTTPS in production

### 3. Performance
- Consider lazy loading the editor iframe
- Implement auto-save functionality
- Optimize bundle size for package distribution

## API Reference

### postMessage Events

#### From Parent to Editor:
- `loadEditor`: Load editor with state
- `fetchState`: Request current editor state

#### From Editor to Parent:
- `editorLoaded`: Editor initialization complete
- `savedState`: Current editor state response

### Component Props (React)

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `initialState` | string | Encoded editor state | `null` |
| `onSave` | function | Save callback | `() => {}` |
| `onPreview` | function | Preview callback | `() => {}` |
| `onHtmlView` | function | HTML view callback | `() => {}` |
| `settings` | object | Editor settings | `null` |
| `height` | string | Editor height | `"600px"` |
| `width` | string | Editor width | `"100%"` |

## Troubleshooting

### Common Issues:

1. **"Invariant failed: Invalid parameter Node Id"**
   - Fixed in current version with proper Node ID validation
   - Ensure proper state initialization before rendering

2. **CSS Import Errors**
   - Install correct versions: `react-quill@1.3.5`, `quill@1.3.7`
   - Check webpack configuration for CSS loading

3. **Cross-Origin Errors**
   - Configure proper CORS headers
   - Validate message origins in event handlers

For additional support, refer to the memory system which contains fixes for known issues.
