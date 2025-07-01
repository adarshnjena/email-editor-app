import _ from "lodash";
import { colors, createTheme as createMuiTheme, responsiveFontSizes, Theme } from "@material-ui/core";
import { typography } from "./typography";
import { softShadows, strongShadows } from "./shadows";
import { THEMES, Settings } from "../context/SettingsContext";

interface ColorShade {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
}

// Monochrome color palette - only black, white, and shades of gray
const modernPalette: {
  primary: ColorShade;
  secondary: ColorShade;
  success: ColorShade;
  info: ColorShade;
  warning: ColorShade;
  error: ColorShade;
  text: TextColors;
} = {
  primary: {
    light: '#757575',  // Medium gray
    main: '#424242',   // Dark gray
    dark: '#212121',   // Very dark gray
    contrastText: '#ffffff'
  },
  secondary: {
    light: '#9e9e9e',  // Light gray
    main: '#757575',   // Medium gray
    dark: '#424242',   // Dark gray
    contrastText: '#ffffff'
  },
  success: {
    light: '#666666',  // Gray shades for success
    main: '#424242',
    dark: '#212121',
    contrastText: '#ffffff'
  },
  info: {
    light: '#9e9e9e',  // Gray shades for info
    main: '#757575',
    dark: '#424242',
    contrastText: '#ffffff'
  },
  warning: {
    light: '#bdbdbd',  // Light gray shades for warning
    main: '#9e9e9e',
    dark: '#757575',
    contrastText: '#000000'
  },
  error: {
    light: '#757575',  // Gray shades for error
    main: '#424242',
    dark: '#212121',
    contrastText: '#ffffff'
  },
  text: {
    primary: '#212121',    // Very dark gray for primary text
    secondary: '#757575',  // Medium gray for secondary text
    disabled: '#bdbdbd'    // Light gray for disabled text
  }
};

const baseConfig = {
    direction: "ltr",
    typography,
    shape: {
        borderRadius: 8
    },
    props: {
        MuiButton: {
            disableElevation: true
        },
        MuiTooltip: {
            arrow: true
        },
        MuiInputLabel: {
            shrink: true
        }
    },
    overrides: {
        MuiLinearProgress: {
            root: {
                borderRadius: 6,
                overflow: "hidden",
                height: 6
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: 32,
                color: 'inherit'
            }
        },
        MuiChip: {
            root: {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: 8
            },
            deleteIcon: {
                color: 'rgba(0,0,0,0.5)',
                '&:hover': {
                    color: 'rgba(0,0,0,0.7)'
                }
            }
        },
        MuiCard: {
            root: {
                borderRadius: 12,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }
        },
        MuiCardHeader: {
            root: {
                padding: '24px 24px 16px'
            }
        },
        MuiCardContent: {
            root: {
                padding: '16px 24px 24px'
            }
        },
        MuiPaper: {
            rounded: {
                borderRadius: 12
            },
            elevation1: {
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            },
            elevation2: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            elevation3: {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }
        },
        MuiButton: {
            root: {
                borderRadius: 6,
                textTransform: 'capitalize',
                fontWeight: 600
            }
        },
        MuiTextField: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 6
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 6
            }
        },
        MuiMenu: {
            paper: {
                borderRadius: 6
            }
        },
        MuiDivider: {
            root: {
                marginTop: 8,
                marginBottom: 8
            }
        }
    }
};

const themeConfigs = [
    {
        name: THEMES.LIGHT,
        overrides: {
            MuiInputBase: {
                input: {
                    "&::placeholder": {
                        opacity: 1,
                        color: modernPalette.text.secondary
                    }
                }
            }
        },
        palette: {
            mode: "light" as const,
            action: {
                active: modernPalette.text.secondary,
                hover: 'rgba(0, 0, 0, 0.04)',
                selected: 'rgba(0, 0, 0, 0.08)',
                disabled: 'rgba(0, 0, 0, 0.26)',
                disabledBackground: 'rgba(0, 0, 0, 0.12)'
            },
            background: {
                default: '#fafafa',  // Very light gray
                dark: "#eeeeee",     // Light gray
                paper: colors.common.white
            },
            primary: modernPalette.primary,
            secondary: modernPalette.secondary,
            success: modernPalette.success,
            info: modernPalette.info,
            warning: modernPalette.warning,
            error: modernPalette.error,
            text: modernPalette.text,
            divider: 'rgba(0, 0, 0, 0.12)'
        },
        shadows: softShadows
    },
    {
        name: THEMES.ONE_DARK,
        palette: {
            mode: "dark" as const,
            action: {
                active: "rgba(255, 255, 255, 0.54)",
                hover: "rgba(255, 255, 255, 0.04)",
                selected: "rgba(255, 255, 255, 0.08)",
                disabled: "rgba(255, 255, 255, 0.26)",
                disabledBackground: "rgba(255, 255, 255, 0.12)",
                focus: "rgba(255, 255, 255, 0.12)"
            },
            background: {
                default: "#212121",  // Very dark gray
                dark: "#171717",     // Almost black
                paper: "#424242"     // Dark gray
            },
            primary: {
                main: "#e0e0e0",     // Light gray
                light: "#f5f5f5",    // Very light gray
                dark: "#bdbdbd",     // Medium light gray
                contrastText: "#212121"
            },
            secondary: {
                main: "#bdbdbd",     // Medium light gray
                light: "#e0e0e0",    // Light gray
                dark: "#9e9e9e",     // Medium gray
                contrastText: "#212121"
            },
            success: {
                light: "#9e9e9e",    // Gray shades
                main: "#757575",
                dark: "#616161",
                contrastText: "#212121"
            },
            info: {
                light: "#bdbdbd",    // Gray shades
                main: "#9e9e9e",
                dark: "#757575",
                contrastText: "#212121"
            },
            warning: {
                light: "#e0e0e0",    // Light gray shades
                main: "#bdbdbd",
                dark: "#9e9e9e",
                contrastText: "#212121"
            },
            error: {
                light: "#9e9e9e",    // Gray shades
                main: "#757575",
                dark: "#616161",
                contrastText: "#212121"
            },
            text: {
                primary: "#f5f5f5",   // Very light gray
                secondary: "#e0e0e0", // Light gray
                disabled: "#9e9e9e"   // Medium gray
            },
            divider: "rgba(255, 255, 255, 0.12)"
        },
        shadows: strongShadows
    },
    {
        name: THEMES.UNICORN,
        palette: {
            mode: "dark" as const,
            action: {
                active: "rgba(255, 255, 255, 0.54)",
                hover: "rgba(255, 255, 255, 0.04)",
                selected: "rgba(255, 255, 255, 0.08)",
                disabled: "rgba(255, 255, 255, 0.26)",
                disabledBackground: "rgba(255, 255, 255, 0.12)",
                focus: "rgba(255, 255, 255, 0.12)"
            },
            background: {
                default: "#000000",  // Pure black
                dark: "#0a0a0a",     // Almost black
                paper: "#1a1a1a"     // Very dark gray
            },
            primary: {
                main: "#ffffff",     // Pure white
                light: "#f5f5f5",    // Very light gray
                dark: "#e0e0e0",     // Light gray
                contrastText: "#000000"
            },
            secondary: {
                main: "#e0e0e0",     // Light gray
                light: "#f5f5f5",    // Very light gray
                dark: "#bdbdbd",     // Medium light gray
                contrastText: "#000000"
            },
            success: {
                light: "#bdbdbd",    // Gray shades
                main: "#9e9e9e",
                dark: "#757575",
                contrastText: "#000000"
            },
            info: {
                light: "#e0e0e0",    // Gray shades
                main: "#bdbdbd",
                dark: "#9e9e9e",
                contrastText: "#000000"
            },
            warning: {
                light: "#f5f5f5",    // Light gray shades
                main: "#e0e0e0",
                dark: "#bdbdbd",
                contrastText: "#000000"
            },
            error: {
                light: "#bdbdbd",    // Gray shades
                main: "#9e9e9e",
                dark: "#757575",
                contrastText: "#000000"
            },
            text: {
                primary: "#ffffff",   // Pure white
                secondary: "#e0e0e0", // Light gray
                disabled: "#757575"   // Medium gray
            },
            divider: "rgba(255, 255, 255, 0.12)"
        },
        shadows: strongShadows
    }
];

export function createTheme(settings: Partial<Settings> = {}): Theme {
    let themeConfig = themeConfigs.find(theme => theme.name === settings.theme);

    if (!themeConfig) {
        console.warn(new Error(`The theme ${settings.theme} is not valid`));
        [themeConfig] = themeConfigs;
    }

    let theme = createMuiTheme(
        _.merge({}, baseConfig, themeConfig, { direction: settings.direction }) as any
    );

    if (settings.responsiveFontSizes) {
        theme = responsiveFontSizes(theme);
    }

    return theme;
}
