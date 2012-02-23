var Color = net.brehaut.Color;

var Palette = {
    colors : [],
    bw : [],
    
    init: function(cssText) {
        var parser = new CSSParser();
        var sheet = parser.parse(cssText, false, true);
        var colorsIndex = {};
        var rule;
        var declarations;
        var color;
        
        Palette.colors = [];
        Palette.bw = [];
        
        //Parse stylesheet and collect colors
        if (sheet && sheet.cssRules) {
            for (var i=0,l=sheet.cssRules.length; i<l; i++) {
                rule = sheet.cssRules[i];
    
                if (!rule.declarations) {
                    continue;
                }
    
                declarations = rule.declarations;
                for (var j=0,m=declarations.length; j<m; j++) {
    
                    if (!declarations[j].property) {
                        continue;
                    }
    
                    if (-1 !== declarations[j].property.indexOf("color")) {
                        color = declarations[j].valueText.toLowerCase();
                        if (colorsIndex[color]) {
                            colorsIndex[color]++;
                        } else {
                            colorsIndex[color] = 1;
                        }
                    }
                }
            }
        }
        
        //Laundry: separate colors from black&white
        for (var value in colorsIndex) {
            color = {
                original: value,
                count: colorsIndex[value],
                color: new Color(value)
            };
            
            if (0 < color.color.getSaturation()) {
                Palette.colors.push(color);
            } else {
                Palette.bw.push(color);
            }
        }
        
        //Sort
        Palette.colors.sort(Palette.compareColor);
        Palette.bw.sort(Palette.compareColor);
        
        return {
            color: Palette.colors, 
            bw : Palette.bw
        };
    },
    
    compareColor : function(c1, c2) {
        c1 = c1.color.toHSL();
        c2 = c2.color.toHSL();
        
        if (c1.hue == c2.hue) {
            if (c1.lightness < c2.lightness) {
                return -1;
            } else if (c1.lightness > c2.lightness) {
                return 1;
            } else {
                return c1.saturation - c2.saturation;
            }
        } else if (c1.hue < c2.hue) {
            return -1
        } else {
            return 1;
        }
    }
};