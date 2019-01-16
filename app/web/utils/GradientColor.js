/**
 *  @file
 *  @author zhouminghui
 *  2018.11.20
 *  Code formatting completed
 */
// Gradient算法  计算该色值区域中的渐变色色值


function GradientColor(startColor, endColor, step) {
    this.startRGB = this.colorRgb(startColor);
    this.startR = this.startRGB[0];
    this.startG = this.startRGB[1];
    this.startB = this.startRGB[2];
    this.endRGB = this.colorRgb(endColor);
    this.endR = this.endRGB[0];
    this.endG = this.endRGB[1];
    this.endB = this.endRGB[2];
    this.sR = (this.endR - this.startR) / step;
    this.sG = (this.endG - this.startG) / step;
    this.sB = (this.endB - this.startB) / step;
    var colorArr = [];
    for (var i = 0; i < step; i++) {
        var hex = this.colorHex('rgb(' + parseInt((this.sR * i + this.startR)) + ',' + parseInt((this.sG * i + this.startG)) + ',' + parseInt((this.sB * i + this.startB)) + ')');
        colorArr.push(hex);
    }
    return colorArr;
}

GradientColor.prototype = {
    colorRgb: function (sColor) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = sColor.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = '#';
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    },
    colorHex: function (rgb) {
        var _this = rgb;
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(_this)) {
            var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
            var strHex = '#';
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;
                if (hex === '0') {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            var aNum = _this.replace(/#/, '').split('');
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                var numHex = '#';
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    }
}

export {
    GradientColor
}