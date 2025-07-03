import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/core';
import { Editor } from '../../components/AceEditor';
import { CircularProgress } from '@material-ui/core';

const decoder = require('he');

const unescapeHTML = (htmlBody: string | null): string | null => {
  if (htmlBody == null) {
    return null;
  }
  return decoder.decode(htmlBody);
};

interface ViewHtmlDialogProps {
  html: string | null;
  onClose: () => void;
}

export function ViewHtmlDialog({ html, onClose }: ViewHtmlDialogProps): JSX.Element {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle disableTypography>
        <Box width="100%" display="flex" alignItems="center">
          <Typography variant="h4">HTML</Typography>
          <Box flexGrow={1} />
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {html === null ? (
          <CircularProgress />
        ) : (
          <Editor
            className=""
            mode="html"
            isView={true}
            height="400px"
            width="100%"
            isDark={false}
            defaultValue=""
            cursorStart={0}
            value={unescapeHTML(html)}
            onChange={() => {}}
            onPaste={() => {}}
            disableSyntaxCheck={true}
            onBlur={() => {}}
            name="html-editor"
            onLoad={() => {}}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ViewHtmlDialog is already exported above with named export
