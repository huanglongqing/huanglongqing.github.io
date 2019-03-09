export function upsetArr(arr){
    let _arr = arr.slice();
    for(let i = 0; i < _arr.length; i++){
        let j = getRandomIntFrom(0, i);
        let temp = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = temp;
    }
    return _arr
}

function getRandomIntFrom(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function deepClone(obj){
    var toStr = Object.prototype.toString,
        arrType = '[object Array]',
        newObj = toStr.call(obj) === arrType ? [] : {};
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            if(typeof(obj[key]) === 'object' && obj[key] !== null){
                newObj[key] = deepClone(obj[key]);
            }else{
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;      
}

/*
    防抖函数：
    handle：需要调用的函数
    delay：延迟时间
*/
export function debounce(handle, delay) {
    var timer;
    return function (...args) {
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            handle.apply(this, args);
        }, delay);
    }
}

/*
    节流函数
    handle:调用的函数
    wait:等待时间（毫秒）
*/
export function throttle(handle, wait) {
    var lastTime = 0;
    return function () {
        //new Date().getTime()从1970到当前所过去的时间（毫秒）
        var nowTime = new Date().getTime();
        //时间差大于等于等待时间，就去执行函数
        if (nowTime - lastTime >= wait) {
            handle.apply(this, arguments);
            lastTime = nowTime;
        }
    }
}