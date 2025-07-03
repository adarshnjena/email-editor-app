import React from "react";
import { ColorButton, ColorPicker, createColor } from "material-ui-color";
import { Badge } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

const transparentColorCode = "#00000000";

interface CustomColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function CustomColorPicker({ value, onChange }: CustomColorPickerProps): JSX.Element {
    const [colorState, setColorState] = React.useState(createColor(value));

    const picker = (
        <ColorPicker
            value={colorState}
            onChange={val => {
                setColorState(val);
                if (val && typeof val === 'object' && 'hex' in val) {
                    onChange("#" + val.hex);
                }
            }}
            hideTextfield
        />
    );

    return value === transparentColorCode ? (
        picker
    ) : (
        <Badge
            badgeContent={
                <CancelIcon
                    color="error"
                    onClick={() => {
                        const transparentColor = createColor(transparentColorCode);
                        setColorState(transparentColor);
                        onChange(transparentColorCode);
                    }}
                    style={{ padding: 1 }}
                    fontSize="small"
                />
            }
            style={{ cursor: "pointer" }}
        >
            {picker}
        </Badge>
    );
}

interface CustomColorButtonProps {
    value: string;
    title: string;
}

export function CustomColorButton({ value, title }: CustomColorButtonProps): JSX.Element {
    return (
        <ColorButton
            tooltip={title ? title + ": " + value : value}
            color={value}
            size={20}
        />
    );
}
