import { extendTheme, ThemeConfig, type Theme } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  colors: {
    // Gold (Primary)
    gold: {
      50: '#FFF9E6',
      100: '#F5CF6B', // Gold Light
      200: '#F0B429', // Primary Gold
      300: '#E5A01A',
      400: '#CC9300', // Gold Dark
      500: '#B88200',
      600: '#996F00',
      700: '#7A5C00',
      800: '#5C4800',
      900: '#3D3000',
    },
    // Magic Blue (Accent)
    magic: {
      50: '#E6F7FC',
      100: '#B3E7F8',
      200: '#80D7F4',
      300: '#4DC7F0',
      400: '#36C5F0', // Primary Magic Blue
      500: '#1AA3CC',
      600: '#1581A3',
      700: '#0F5F7A',
      800: '#0A3D52',
      900: '#051B29',
    },
    // Background
    background: {
      primary: '#0F1419', // Background
      card: '#1A1F29', // Card
      secondary: '#1F2937', // Secondary
      muted: '#252A33', // Muted
    },
    // Foreground
    foreground: {
      primary: '#FFF9E6', // Foreground
      muted: '#B8B5A8', // Muted text
    },
    // Destructive
    red: {
      50: '#FEE2E2',
      100: '#FECACA',
      200: '#FCA5A5',
      300: '#F87171',
      400: '#EF4444', // Destructive
      500: '#DC2626',
      600: '#B91C1C',
      700: '#991B1B',
      800: '#7F1D1D',
      900: '#63171B',
    },
    // Keep blue for compatibility
    blue: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004380',
      800: '#002b4d',
      900: '#00131a',
    },
  },
  fonts: {
    heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'background.primary' : 'gray.50',
        color: props.colorMode === 'dark' ? 'foreground.primary' : 'gray.800',
        fontFamily: 'body',
        transition: 'background-color 0.2s, color 0.2s',
      },
      '*::placeholder': {
        color: props.colorMode === 'dark' ? 'foreground.muted' : 'gray.500',
      },
      '*, *::before, &::after': {
        borderColor: props.colorMode === 'dark' ? 'background.muted' : 'gray.200',
      },
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: '10px',
        height: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderRadius: '5px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
      // Selection color
      '::selection': {
        backgroundColor: props.colorMode === 'dark' ? 'rgba(240, 180, 41, 0.3)' : 'rgba(240, 180, 41, 0.2)',
        color: 'inherit',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'wide',
        textTransform: 'uppercase',
        fontSize: 'sm',
        borderRadius: 'md',
        transition: 'all 0.2s',
        _focus: {
          boxShadow: 'outline',
        },
      },
      sizes: {
        sm: {
          fontSize: 'xs',
          px: 3,
          py: 2,
          h: '32px',
        },
        md: {
          fontSize: 'sm',
          px: 4,
          py: 2,
          h: '40px',
        },
        lg: {
          fontSize: 'md',
          px: 6,
          py: 3,
          h: '48px',
        },
        xl: {
          fontSize: 'lg',
          px: 8,
          py: 4,
          h: '56px',
        },
      },
      variants: {
        default: {
          bg: 'gold.200',
          color: 'background.primary',
          _hover: {
            bg: 'gold.100',
            transform: 'scale(1.05)',
            boxShadow: '2xl',
          },
          _active: {
            bg: 'gold.300',
          },
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            _hover: {
              transform: 'none',
            },
          },
        },
        hero: (props: any) => ({
          bgGradient: 'linear(to-r, #F0B429, #F5CF6B, #36C5F0)',
          color: 'background.primary',
          fontWeight: 'extrabold',
          boxShadow: '0 0 20px rgba(240, 180, 41, 0.4)',
          _hover: {
            transform: 'scale(1.05)',
            boxShadow: '0 0 30px rgba(240, 180, 41, 0.6)',
          },
          _active: {
            transform: 'scale(0.98)',
          },
        }),
        magic: {
          bg: 'magic.400',
          color: 'background.primary',
          _hover: {
            bg: 'magic.300',
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px rgba(54, 197, 240, 0.4)',
          },
          _active: {
            bg: 'magic.500',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'gold.200',
          color: 'gold.200',
          bg: 'transparent',
          _hover: {
            bg: 'gold.200',
            color: 'background.primary',
            transform: 'scale(1.05)',
            boxShadow: 'xl',
          },
          _active: {
            bg: 'gold.300',
            borderColor: 'gold.300',
          },
        },
        solid: (props: any) => ({
          bg: props.colorScheme === 'gold' ? 'gold.200' : `${props.colorScheme}.500`,
          color: props.colorScheme === 'gold' ? 'background.primary' : 'white',
          _hover: {
            bg: props.colorScheme === 'gold' ? 'gold.100' : `${props.colorScheme}.400`,
            transform: 'scale(1.05)',
            boxShadow: '2xl',
          },
        }),
        ghost: (props: any) => ({
          color: props.colorMode === 'dark' ? 'foreground.primary' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'background.secondary' : 'gray.100',
          },
        }),
      },
      defaultProps: {
        variant: 'default',
        colorScheme: 'gold',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'extrabold',
        letterSpacing: 'tight',
        lineHeight: 'tight',
      },
      sizes: {
        '4xl': {
          fontSize: '2.25rem',
          lineHeight: 1.1,
        },
        '5xl': {
          fontSize: '3rem',
          lineHeight: 1.1,
        },
        '6xl': {
          fontSize: '3.75rem',
          lineHeight: 1.1,
        },
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'background.card' : 'white',
          borderRadius: 'lg',
          boxShadow: props.colorMode === 'dark' ? 'lg' : 'md',
          border: '1px',
          borderColor: props.colorMode === 'dark' ? 'background.muted' : 'gray.200',
          transition: 'all 0.2s',
        },
      }),
      variants: {
        elevated: (props: any) => ({
          container: {
            bg: props.colorMode === 'dark' ? 'rgba(26, 31, 41, 0.8)' : 'white',
            backdropFilter: 'blur(10px)',
            borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'gray.200',
            _hover: {
              borderColor: 'gold.200',
              transform: 'scale(1.05)',
              boxShadow: '2xl',
            },
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'background.card' : 'white',
            borderColor: props.colorMode === 'dark' ? 'background.muted' : 'gray.300',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'background.secondary' : 'gray.400',
            },
            _focus: {
              borderColor: 'gold.200',
              boxShadow: '0 0 0 1px var(--chakra-colors-gold-200)',
            },
          },
        }),
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 'xs',
        letterSpacing: 'wide',
      },
      variants: {
        gold: {
          bg: 'gold.200',
          color: 'background.primary',
        },
        magic: {
          bg: 'magic.400',
          color: 'background.primary',
        },
        outline: (props: any) => ({
          border: '2px solid',
          borderColor: props.colorScheme === 'gold' ? 'gold.200' : props.colorScheme === 'magic' ? 'magic.400' : 'background.muted',
          color: props.colorScheme === 'gold' ? 'gold.200' : props.colorScheme === 'magic' ? 'magic.400' : 'foreground.muted',
          bg: 'transparent',
        }),
      },
    },
  },
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: 'gray.800',
        _dark: 'foreground.primary',
      },
      'chakra-body-bg': {
        _light: 'gray.50',
        _dark: 'background.primary',
      },
      'chakra-border-color': {
        _light: 'gray.200',
        _dark: 'background.muted',
      },
    },
  },
})
