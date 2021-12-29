import React, { useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: "10px",

    },
    heading: {
      fontSize: theme.typography.pxToRem(20),
      flexBasis: '33.33%',
      flexShrink: 0,
      color: "black"
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

interface CustomAccordionProps {
  title: string,
  children?: any,
  props?: any
}


const CustomAccordion = ({ title, children, ...props }: CustomAccordionProps) => {

  const [expanded, setExpanded] = useState<string | false>(false);
  const classes = useStyles();
  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === title} onChange={handleChange(title)} {...props}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={`${classes.heading} pdd-left-30`}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }} >
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default CustomAccordion
