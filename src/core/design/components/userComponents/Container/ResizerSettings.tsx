import { useEditor } from '@craftjs/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  AccordionHeader,
  BackgroundAccordion,
  BorderAccordion,
  MarginAccordion,
  PaddingAccordion,
} from '../UtilComponents';

import { ContainerDefaultProps } from './ContainerSettings';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular as any,
    padding: 2,
  },
  Accordion: {
    backgroundColor: '#e0e0e0',
  },
}));

interface ResizerSettingsProps {
  id: string;
  isParent?: boolean;
}

export const ResizerSettings: React.FC<ResizerSettingsProps> = ({ id, isParent }) => {
  const {
    actions: { setProp },
    state,
    query: { node },
  } = useEditor((state, query) => {
    return {
      state: state,
    };
  });
  const props =
    state && state.nodes && state.nodes[id] && state.nodes[id].data && state.nodes[id].data.props
      ? state.nodes[id].data.props
      : ContainerDefaultProps;
  const handleSetProp = (val) => {
    setProp(id, (props) => {
      val(props);
    });
  };

  return (
    <>
      {isParent && <AccordionHeader title={'Spacing'} />}
      <MarginAccordion props={props} setProp={handleSetProp} />
      <PaddingAccordion props={props} setProp={handleSetProp} />
      {isParent && <AccordionHeader title={'Decoration'} />}
      <BackgroundAccordion
        props={props}
        setProp={handleSetProp}
        isSelfBg={true}
        defaultImage={ContainerDefaultProps.style.backgroundImage}
      />
      <BorderAccordion props={props} setProp={handleSetProp} />
    </>
  );
};
