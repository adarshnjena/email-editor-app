import _ from "lodash";
import { colors, createTheme as createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import typography from "./typography";
import { softShadows, strongShadows } from "./shadows";
import { THEMES } from "../context/SettingsContext";

// Modern color palette
const modernPalette = {
  primary: {
    light: '#6573c3',
    main: '#3f51b5',
    dark: '#2c387e',
    contrastText: '#ffffff'
  },
  secondary: {
    light: '#33c9dc',
    main: '#00acc1',
    dark: '#007c91',
    contrastText: '#ffffff'
  },
  success: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    contrastText: '#ffffff'
  },
  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#0d47a1',
    contrastText: '#ffffff'
  },
  warning: {
    light: '#ffb74d',
    main: '#ff9800',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)'
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#ffffff'
  },
  text: {
    primary: '#2d3748',
    secondary: '#718096',
    disabled: '#a0aec0'
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
            type: "light",
            action: {
                active: modernPalette.text.secondary,
                hover: 'rgba(0, 0, 0, 0.04)',
                selected: 'rgba(0, 0, 0, 0.08)',
                disabled: 'rgba(0, 0, 0, 0.26)',
                disabledBackground: 'rgba(0, 0, 0, 0.12)'
            },
            background: {
                default: '#f7f9fc',
                dark: "#edf2f7",
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
            type: "dark",
            action: {
                active: "rgba(255, 255, 255, 0.54)",
                hover: "rgba(255, 255, 255, 0.04)",
                selected: "rgba(255, 255, 255, 0.08)",
                disabled: "rgba(255, 255, 255, 0.26)",
                disabledBackground: "rgba(255, 255, 255, 0.12)",
                focus: "rgba(255, 255, 255, 0.12)"
            },
            background: {
                default: "#1a202c",
                dark: "#171923",
                paper: "#2d3748"
            },
            primary: {
                main: "#90cdf4",
                light: "#bee3f8",
                dark: "#63b3ed",
                contrastText: "#1a202c"
            },
            secondary: {
                main: "#9f7aea",
                light: "#b794f4",
                dark: "#805ad5",
                contrastText: "#1a202c"
            },
            success: {
                light: "#68d391",
                main: "#48bb78",
                dark: "#38a169",
                contrastText: "#1a202c"
            },
            info: {
                light: "#63b3ed",
                main: "#4299e1",
                dark: "#3182ce",
                contrastText: "#1a202c"
            },
            warning: {
                light: "#fbd38d",
                main: "#ed8936",
                dark: "#dd6b20",
                contrastText: "#1a202c"
            },
            error: {
                light: "#feb2b2",
                main: "#fc8181",
                dark: "#f56565",
                contrastText: "#1a202c"
            },
            text: {
                primary: "#f7fafc",
                secondary: "#e2e8f0",
                disabled: "#a0aec0"
            },
            divider: "rgba(255, 255, 255, 0.12)"
        },
        shadows: strongShadows
    },
    {
        name: THEMES.UNICORN,
        palette: {
            type: "dark",
            action: {
                active: "rgba(255, 255, 255, 0.54)",
                hover: "rgba(255, 255, 255, 0.04)",
                selected: "rgba(255, 255, 255, 0.08)",
                disabled: "rgba(255, 255, 255, 0.26)",
                disabledBackground: "rgba(255, 255, 255, 0.12)",
                focus: "rgba(255, 255, 255, 0.12)"
            },
            background: {
                default: "#0f172a",
                dark: "#0b1222",
                paper: "#1e293b"
            },
            primary: {
                main: "#38bdf8",
                light: "#7dd3fc",
                dark: "#0c89cb",
                contrastText: "#0f172a"
            },
            secondary: {
                main: "#f472b6",
                light: "#f9a8d4",
                dark: "#db2777",
                contrastText: "#0f172a"
            },
            success: {
                light: "#86efac",
                main: "#34d399",
                dark: "#10b981",
                contrastText: "#0f172a"
            },
            info: {
                light: "#bae6fd",
                main: "#38bdf8",
                dark: "#0ea5e9",
                contrastText: "#0f172a"
            },
            warning: {
                light: "#fdba74",
                main: "#fb923c",
                dark: "#f97316",
                contrastText: "#0f172a"
            },
            error: {
                light: "#fda4af",
                main: "#fb7185",
                dark: "#e11d48",
                contrastText: "#0f172a"
            },
            text: {
                primary: "#f8fafc",
                secondary: "#e2e8f0",
                disabled: "#94a3b8"
            },
            divider: "rgba(255, 255, 255, 0.12)"
        },
        shadows: strongShadows
    }
];

export function createTheme(settings = {}) {
    let themeConfig = themeConfigs.find(theme => theme.name === settings.theme);

    if (!themeConfig) {
        console.warn(new Error(`The theme ${settings.theme} is not valid`));
        [themeConfig] = themeConfigs;
    }

    let theme = createMuiTheme(
        _.merge({}, baseConfig, themeConfig, { direction: settings.direction })
    );

    if (settings.responsiveFontSizes) {
        theme = responsiveFontSizes(theme);
    }

    return theme;
}
