import { Element, useNode } from "@craftjs/core";
import React from "react";
import { Resizer } from "./Resizer";
import { ContainerDefaultProps, ContainerSettings } from "./ContainerSettings";
import { Grid } from "@material-ui/core";

interface ContainerProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    parentStyle?: React.CSSProperties;
    props?: any;
}

export const Container: React.FC<ContainerProps> = ({ children, style, parentStyle, props }) => {
    const type = props.containerType;
    const w = Math.floor(12 / type) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const {
        connectors: { connect, drag }
    } = useNode(node => {
        return {};
    });
    return (
        <Resizer craftRef={connect} style={style} parentStyle={parentStyle} props={props}>
            {type > 1 ? (
                <>
                    {[...Array(type)].map((e, i) => {
                        return (
                            <Grid item key={i} xs={w}>
                                <Element
                                    id={`column${i}`}
                                    canvas
                                    is={Resizer}
                                    key={i}
                                    custom={{
                                        displayName: "Column " + `${i + 1}`
                                    }}
                                ></Element>
                            </Grid>
                        );
                    })}
                </>
            ) : (
                <>{children}</>
            )}
        </Resizer>
    );
};

(Container as any).craft = {
    props: ContainerDefaultProps,

    displayName: "Columns",
    related: {
        settings: ContainerSettings
    },
    rules: {
        canMoveIn: (node: any, self: any) => {
            if (node.data.displayName === "Columns" && self.data.custom.displayName !== "Main") {
                return false;
            } else return true;
        }
    }
};
