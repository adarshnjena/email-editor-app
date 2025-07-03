import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { EmailEditor as Designer } from './core/design/EmailEditor';
import { reportWebVitals } from './reportWebVitals';
import { AppProvider } from './providers';
import { useAppContext } from './context/AppContext';
import { restoreSettings } from './utils/settings';
import { useIsMountedRef } from './hooks/useIsMountedRef';
import { decodeJson } from './core/design/utils/encryptJson';
import { ViewPreviewDialog } from './core/design/preview/ViewPreviewDialog';
import { ViewHtmlDialog } from './core/design/preview/ViewHtmlDialog';

// Define state_version constant (matches package.json)
const state_version = '1.0.0';

const PARENT_URL =
  window.location !== window.parent.location ? document.referrer : document.location.href;

interface EditorState {
  json: any;
  version: string;
}

interface StateData {
  html?: string;
  [key: string]: any;
}

interface MessageEvent {
  origin: string;
  data: {
    message: string;
    value?: any;
  };
}

function EmailEditorApp(): JSX.Element {
  const isMountedRef = useIsMountedRef();
  const { editorState, setEditorState, version, setVersion } = useAppContext();
  const [triggerFetchState, setTriggerFetchState] = React.useState<boolean>(false);
  const [previewState, setPreviewState] = React.useState<string | null>(null);
  const [htmlState, sethtmlState] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<string>('');

  const parseState = useCallback(
    (stateArg: string) => {
      let stateJson = null;
      let stateVersion = '';
      try {
        if (stateArg) {
          const stateVal = decodeJson(stateArg);
          if (stateVal) {
            const tmp = JSON.parse(stateVal);
            stateJson = tmp['json'];
            stateVersion = tmp['version'];
          }
        }
      } catch (err: any) {
        const error = new Error(`Invalid Editor State.\n${err.message}`);
        error.stack = err.stack;
        return null;
      }
      setEditorState({ json: stateJson, version: stateVersion });
      setVersion(stateVersion);
    },
    [setEditorState, setVersion]
  );

  const getState = (obj: StateData) => {
    postMessage('savedState', obj);
    if (mode === 'preview') {
      setPreviewState(obj.html || '');
    } else if (mode === 'html') {
      sethtmlState(obj.html || '');
    }
    setTriggerFetchState(false);
  };

  const onClose = () => {
    setMode('');
  };

  const receiveMessage = useCallback(
    (event: MessageEvent) => {
      if (!PARENT_URL.includes(event.origin)) return;
      const message = event.data.message;
      switch (message) {
        case 'loadEditor':
          parseState(event.data.value);
          postMessage('editorLoaded', true);
          break;
        case 'fetchState':
          setTriggerFetchState(true);
          break;
        default:
      }
    },
    [parseState]
  );

  useEffect(() => {
    window.addEventListener('message', receiveMessage as any, false);

    // Initialize with default state if accessed directly (not in iframe)
    if (window.location === window.parent.location) {
      // Not in iframe, initialize with default empty state
      setEditorState({
        json: null, // Will create empty editor
        version: state_version,
      });
      setVersion(state_version);
    }
  }, [isMountedRef, receiveMessage, setEditorState, setVersion]);

  function postMessage(type: string, value: any) {
    window.parent.postMessage({ message: type, value: value }, PARENT_URL);
  }

  const onPreviewOpen = () => {
    setMode('preview');
    setTriggerFetchState(true);
  };

  const onHtmlOpen = () => {
    setMode('html');
    setTriggerFetchState(true);
  };
  return editorState ? (
    <>
      <Designer
        loadState={editorState.json}
        loadVersion={editorState.version || version}
        triggerFetchState={triggerFetchState}
        getState={getState}
        onPreviewOpen={onPreviewOpen}
        onHtmlOpen={onHtmlOpen}
      />
      {mode === 'preview' && (
        <ViewPreviewDialog previewDoc={previewState} onClose={onClose} title="Preview" />
      )}
      {mode === 'html' && <ViewHtmlDialog html={htmlState} onClose={onClose} />}
    </>
  ) : (
    <div>Loading...</div>
  );
}

function EmailEditor(): JSX.Element {
  return (
    <AppProvider settings={restoreSettings()}>
      <EmailEditorApp />
    </AppProvider>
  );
}

ReactDOM.render(<EmailEditor />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
