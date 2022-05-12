export function splitImgUrl(str) {
  if (str === '') return
  const picArr = str.split(',')
  const newArr = []
  for (let i = 0; i < picArr.length; i++) {
    newArr.push(process.env.TASK_IMAGE_URL + picArr[i])
  }
  return newArr
}
