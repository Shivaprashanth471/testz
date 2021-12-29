import { MenuItem, TextField } from "@material-ui/core";
import React from "react";

function CustomSelect(props: any) {
  return (
    <TextField
      fullWidth
      select
      value={props.value}
      label={props.label}
      name={props.name}
      onChange={props.onChange}
      margin="dense"
      InputLabelProps={{ shrink: true }}
      {...props}
    >
      {props.options?.map((item: any, index: number) => (
        <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
      ))}
    </TextField>
  );
}

export default CustomSelect;
