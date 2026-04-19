


export default function randomPassword(len) {

    let passwd = ''
    do {
        passwd += Math.random().toString(36).substr(2)
    } while (passwd.length < len)
    passwd = passwd.substr(0, len)
    return passwd.toUpperCase()

    return passwd
}

export  function randomNumberPassword(len) {
    let passwd = ''
    do {
        passwd += Math.floor(Math.random() * 10) // gera dígito de 0 a 9
    } while (passwd.length < len)
    return passwd
}