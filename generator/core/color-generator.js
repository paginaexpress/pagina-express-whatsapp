/**
 * generator/core/color-generator.js
 */
const ColorGenerator = {
    generatePalette: (manualColor) => {
        const primary = manualColor || '#1a73e8';
        return {
            primary: primary,
            primary_dark: ColorGenerator.shadeColor(primary, -20),
            accent: '#ff9800',
            background_light: '#f8f9fa',
            text_main: '#202124'
        };
    },
    shadeColor: (color, percent) => {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    }
};

if (typeof module !== 'undefined') {
    module.exports = ColorGenerator;
} else {
    window.ColorGenerator = ColorGenerator;
}
