import { TextField } from '@material-ui/core';
import React from 'react';

function CustomTextField(props: any) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      label={props.label}
      name={props.name}
      onChange={props.onChange}
      margin='dense'
      {...props}
    />
  );
}

export default CustomTextField;
