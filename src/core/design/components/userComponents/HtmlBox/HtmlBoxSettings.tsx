import { useNode } from "@craftjs/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { unescapeHTML } from "../../../utils/unescapeHtml";
import {
    AccordionHeader,
    MarginAccordion,
    PaddingAccordion
} from "../UtilComponents/SettingsUtils";
import Editor from "../../../../components/AceEditor";
import { CustomAccordion } from "../UtilComponents/Accordion";
import { MARGIN, PADDING } from "../Defaults";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular as any,
        margin: 2
    }
}));

let isHtmlPaste = true;

export const HtmlBoxSettings = (): JSX.Element => {
    const {
        actions: { setProp },
        props
    } = useNode(node => ({
        props: node.data.props
    }));
    const classes = useStyles();
    const [html, setHtml] = React.useState<string>(unescapeHTML(props.props.html));
    
    const handleHtmlChange = (value: string): void => {
        if (isHtmlPaste) {
            isHtmlPaste = false;
            setHtml(unescapeHTML(value));
        } else {
            setHtml(value);
        }
        setProp((props: any) => {
            props.props.html = value;
        });
    };

    return (
        <div>
            <AccordionHeader title={"Basic"} />
            <CustomAccordion
                title="HTML"
                defaultExpanded={false}
                children={
                    <Editor
                        className=""
                        height="400px"
                        mode="html"
                        isView={false}
                        width="100%"
                        isDark={false}
                        defaultValue=""
                        cursorStart={0}
                        onChange={handleHtmlChange}
                        onPaste={() => {
                            isHtmlPaste = true;
                        }}
                        value={html}
                        disableSyntaxCheck={true}
                        onBlur={() => {}}
                        name="html-editor"
                        onLoad={() => {}}
                    />
                }
            />
            <AccordionHeader title={"Spacing"} />
            <MarginAccordion props={props} setProp={setProp} />
            <PaddingAccordion props={props} setProp={setProp} />
        </div>
    );
};

export const HtmlBoxDefaultProps = {
    props: {
        html: "<h4>Hello, world!</h4>"
    },
    parentStyle: {
        ...PADDING,

        ...MARGIN
        // overflowWrap: "break-word"
    },
    options: {
        paddingOptions: "less",
        marginOptions: "less"
    }
};
