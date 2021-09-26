import moment from 'moment'
export const getObjAttriValue = (origin: Object, target: Object) => {
	for (let key of Object.keys(origin)) {
		if (target[key] === false) {
			origin[key] = false
		} else if (target[key]) {
			origin[key] = target[key]
		}
	}
}

export const getTimeFormate = (date, formate) => {
	return moment(date).format(formate)
}

/**
 * 获取当前日期用'-'符号拼接
 */
export function getCurrentDate() {
	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1
	const day = new Date().getDate()
	return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}


/**
 * 获取最近一个月日期，返回数组
 */
export function getRecentMonth() {
	const end = new Date()
	const year = end.getFullYear()
	const month = end.getMonth() + 1 //0-11表示1-12月
	const day = end.getDate()
	let startDate = ''
	let endDate = ''
	endDate = year + '-' + `${month<10?'0'+month:month}` + '-' + `${day<10?'0'+day:day}`
	const endMonthDay = new Date(year, month, 0).getDate() //当前月的总天数
	if (month - 1 <= 0) {
		//如果是1月，年数往前推一年<br>
		startDate = year - 1 + '-' + 12 + '-' + `${day<10?'0'+day:day}`
	} else {
		const startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate()
		const resMonth = (month - 1)
		if (startMonthDay < day) {
			//1个月前所在月的总天数小于现在的天日期
			if (day < endMonthDay) {
				const  resDay = (startMonthDay - (endMonthDay - day))
				//当前天日期小于当前月总天数
				startDate =
					year + '-' + `${resMonth<10?'0'+resMonth:resMonth}` + '-' + `${resDay<10?'0'+resDay:resDay}`
			} else {
				startDate = year + '-' + `${resMonth<10?'0'+resMonth:resMonth}` + '-' + `${startMonthDay<10?'0'+startMonthDay:startMonthDay}`
			}
		} else {
			startDate = year + '-' + `${resMonth<10?'0'+resMonth:resMonth}` + '-' + `${day<10?'0'+day:day}`
		}
	}
	return [startDate, endDate]
}
