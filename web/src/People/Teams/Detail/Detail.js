import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Activity from './Activity/Activity';
import Skills from './Skills/Skills';

export default function Detail({ developer, handleClose, open, toggle }) {
  return <Dialog fullWidth={true} maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
      {developer.name} {developer.surname} - {developer.role}
    </DialogTitle>
    <DialogContent dividers>
      <Skills developer={developer} />
      <Activity developer={developer} toggle={toggle} />
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={handleClose} color="primary"> Close </Button>
    </DialogActions>
  </Dialog>;
}