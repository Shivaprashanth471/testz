import { MenuItem } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import InputAdornment from "@material-ui/core/InputAdornment";
import BackspaceIcon from "@material-ui/icons/Backspace";
import React, { useState } from "react";

function CustomSelectHybrid(props: any) {
  const [other, setOther] = useState(false);

  return (
    <>
      <TextField
        fullWidth
        select={other ? false : true}
        value={props.value}
        label={props.label}
        defaultValue={props?.defaultValue}
        name={props.name}
        onChange={props.onChange}
        margin="dense"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {other && (
                <BackspaceIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setOther((prevState) => !prevState)}
                />
              )}
            </InputAdornment>
          ),
        }}
        // InputLabelProps={{ shrink: true }}
        {...props}
      >
        {!props.other &&
          props.options?.map((item: any) => (
            <MenuItem value={item.value}>{item.label}</MenuItem>
          ))}
        {!props.unhybrid && (
          <MenuItem onClick={() => setOther((prevState) => !prevState)}>
            Other
          </MenuItem>
        )}
      </TextField>
    </>
  );
}

export default CustomSelectHybrid;
