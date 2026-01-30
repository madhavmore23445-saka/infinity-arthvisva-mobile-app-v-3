export const theme = {
    colors: {
        primary: '#1A73E8',      // Google Blue
        secondary: '#00BFA5',    // Premium Teal
        accent: '#FFAB00',       // Amber Accent
        background: '#FFFFFF',   // Pure White
        surface: '#F8F9FA',      // Light Gray Surface
        text: '#202124',         // Material Dark Text
        textSecondary: '#5F6368', // Material Medium Text
        error: '#D93025',        // Material Red Error
        success: '#1E8E3E',      // Material Green Success
        border: '#DADCE0',       // Standard Material Border
        white: '#FFFFFF',
        black: '#000000',
        activeTab: '#1A73E8',
        inactiveTab: '#F1F3F4',
        tabTextActive: '#1A73E8',
        tabTextInactive: '#5F6368',
        buttonGradient: ['#1A73E8', '#00BFA5'], // Note: This is for logical reference

        // Lead Management Specific
        brandTeal: '#1CADA3',
        brandBlue: '#2076C7',
        tableHeader: '#F9FAFB',
        tableBorder: '#E5E7EB',
        rowAlternate: '#FBFBFB',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 100,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
        h2: { fontSize: 22, fontWeight: '700' },
        h3: { fontSize: 18, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        caption: { fontSize: 14, fontWeight: '500' },
        label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    }
};

export default theme;
