/*
 * huangzongzhe 
 * 2018.07.25 in IFC hoopox
 * 密码强度检测
 * source: https://blog.csdn.net/Yeoman92/article/details/53367570
 */
function charType(num) {
    if (num >= 48 && num <= 57) {
        return 1;
    }
    if (num >= 97 && num <= 122) {
        return 2;
    }
    if (num >= 65 && num <= 90) {
        return 4;
    }
    return 8;
}

function check(password) {
    let level = 0;
    let type = '至少九位混合大小写、数字、特殊字符等';
    let pwd = password.toString();

    if (pwd.length >= 9) {
        let result = 0;
        for (let i = 0, len = pwd.length; i < len; ++i) {
            result |= charType(pwd.charCodeAt(i));
        }
        //对result进行四次循环，计算其level
        for (let i = 0; i <= 4; i++) {
            if (result & 1) {
                level++;
            }
            //右移一位
            result = result >>> 1;
        }
        switch (level) {
            case 1:
                // type = "弱密码";
                type = "强度不够";
                break;
            case 2:
                // type = "中等强度";
                type = "强度不够";
                break;
            case 3:
            case 4:
                type = "高强度";
                break;
        }
    }
    return {
        level: level,
        type: type
    };
}


export default check 