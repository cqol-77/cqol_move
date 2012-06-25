function css(obj, attr, value) {
    if (arguments.length == 2)
        return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]);
    else if (arguments.length == 3)
        switch (attr) {
            case 'width':
            case 'height':
            case 'paddingLeft':
            case 'paddingTop':
            case 'paddingRight':
            case 'paddingBottom':
                value = Math.max(value, 0);
            case 'left':
            case 'top':
            case 'marginLeft':
            case 'marginTop':
            case 'marginRight':
            case 'marginBottom':
                obj.style[attr] = value + 'px';
                break;
            case 'opacity':
                obj.style.filter = "alpha(opacity=" + value + ")";
                obj.style.opacity = value / 100;
                break;
            default:
                obj.style[attr] = value;
        }

    return function (attr_in, value_in) {
        css(obj, attr_in, value_in)
    };
}
/*function css(obj, attr, value) {
 if(arguments.length==2){
 return parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);
 }
 else if (arguments.length == 3){
 attr == "opacity" ? (obj.style.filter = "alpha(opacity=" + value + ")", obj.style.opacity = value / 100) : obj.style[attr] = value + "px"
 }
 }*/
var MOVE_TYPE = {
    BUFFER: 1,
    FLEX: 2,
    AVER:3
};

function StartMove(obj, oTarget, iType, fnCallBack, fnDuring) {
    var fnMove = null;
    if (obj.timer) {
        clearInterval(obj.timer);
    }

    switch (iType) {
        case MOVE_TYPE.BUFFER:
            fnMove = DoMoveBuffer;
            break;
        case MOVE_TYPE.FLEX:
            fnMove = DoMoveFlex;
            break;
        case MOVE_TYPE.AVER:
            fnMove = DoMoveAver;
    }

    obj.timer = setInterval(function () {
        fnMove(obj, oTarget, fnCallBack, fnDuring);
    }, 20);
}
function DoMoveAver(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;
    for (attr in oTarget) {
        cur = attr == 'opacity' ? parseInt(css(obj, attr).toFixed(2) * 100) : css(obj, attr);
        speed += 2;
/*      oTarget[attr] != cur && (bStop = false,css(obj, attr, cur + speed));
        if(cur > oTarget[attr]) {
            css(obj, attr, oTarget[attr] )
        }*/
        cur > oTarget[attr] ? css(obj, attr, oTarget[attr]) : (bStop = false, css(obj, attr, cur + speed));
    }
    if (fnDuring)fnDuring.call(obj);
    bStop && (clearInterval(obj.timer),obj.timer = null,fnCallBack && fnCallBack.call(obj));
}
function DoMoveBuffer(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;

    for (attr in oTarget) {
        //cur = attr=='opacity' ? parseInt(css(obj, attr).toFixed(2)*100) : css(obj, attr);
        if (attr == 'opacity') {
            cur = parseInt(css(obj, attr).toFixed(2) * 100);
            speed += 2;
            speed > 100 && (speed = 100);
            oTarget[attr] != cur && (bStop = false,css(obj, attr, cur + speed));
        } else {
            cur = css(obj, attr);
            speed = (oTarget[attr] - cur) / 5;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            oTarget[attr] != cur && (bStop = false,css(obj, attr, cur + speed));
        }
        /*if(oTarget[attr]!=cur)
         {
         bStop=false;

         speed=(oTarget[attr]-cur)/5;
         speed=speed>0?Math.ceil(speed):Math.floor(speed);

         css(obj, attr, cur+speed);
         }*/
    }

    if (fnDuring)fnDuring.call(obj);
    bStop && (clearInterval(obj.timer),obj.timer = null,fnCallBack && fnCallBack.call(obj));
    /*if(bStop)
     {
     clearInterval(obj.timer);
     obj.timer=null;

     if(fnCallBack)fnCallBack.call(obj);
     }*/
}

function DoMoveFlex(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;

    for (attr in oTarget) {
        if (!obj.oSpeed)obj.oSpeed = {};
        if (!obj.oSpeed[attr])obj.oSpeed[attr] = 0;
        cur = attr == 'opacity' ? parseInt(css(obj, attr).toFixed(2) * 100) : css(obj, attr);
        //cur=css(obj, attr);
        if (Math.abs(oTarget[attr] - cur) > 1 || Math.abs(obj.oSpeed[attr]) > 1) {
            bStop = false;

            obj.oSpeed[attr] += (oTarget[attr] - cur) / 5;
            obj.oSpeed[attr] *= 0.7;
            var maxSpeed = 65;
            if (Math.abs(obj.oSpeed[attr]) > maxSpeed) {
                obj.oSpeed[attr] = obj.oSpeed[attr] > 0 ? maxSpeed : -maxSpeed;
            }
            css(obj, attr, cur + obj.oSpeed[attr]);
        }
    }

    if (fnDuring)fnDuring.call(obj);
    bStop && (clearInterval(obj.timer),obj.timer = null,fnCallBack && fnCallBack.call(obj));
    /*if(bStop)
     {
     clearInterval(obj.timer);
     obj.timer=null;
     if(fnCallBack)fnCallBack.call(obj);
     }*/
}