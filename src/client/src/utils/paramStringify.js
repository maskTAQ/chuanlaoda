const paramStringify = (data) => {
    let url = '';
    for (let k in data) {
        let value = data[k] !== undefined
            ? data[k]
            : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }

    //去掉第一个参数的&符号
    return url
        ? url.substring(1)
        : ''
}

export default paramStringify;