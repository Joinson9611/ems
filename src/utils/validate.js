/**
 * Created by jiachenpan on 16/11/18.
 */
export function isvalidUsername(str) {
  if (str.length < 3 || str.length > 32) {
    return false
  } else if (check_other_char(str)) {
    return false
  } else {
    return true
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 验证用户名是否含有特殊字符
export function check_other_char(str) {
  const UserName = '^(?=[0-9a-zA-Z_]+$)'
  const REG = new RegExp(UserName)
  if (REG.test(str)) {
    return false
  } else {
    return true
  }
}

// export function check_hexadecimal(str) {
//   const name = '^[A-Fa-f0-9]{1,4}$'
//   const REG = new RegExp(name)
//   if (REG.test(str)) {
//     return false
//   } else {
//     return true
//   }
// }
