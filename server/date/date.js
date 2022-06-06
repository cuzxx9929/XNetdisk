function getDate(){
	var date = new Date() 

	var year = date.getFullYear(),
		month = date.getMonth()+1,
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds() 

	var preArr = Array.apply(null,Array(10)).map(function(elem, index) {
		return '0'+index 
	})

	var newTime = year + '-' +
				(preArr[month]||month) + '-' +
				(preArr[day]||day) + ' ' +
				(preArr[hour]||hour) + ':' +
				(preArr[min]||min) + ':' +
				(preArr[sec]||sec) 

	return newTime 			
}

module.exports.getDate = getDate