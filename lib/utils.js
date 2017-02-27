exports.convertKelvinToFarenheit = function (kelvin) {
  return Math.round((kelvin * 9/5 - 459.67) * 10) /10
}

exports.convertKevlinToCelsius = function(kelvin) {
  return Math.round((kelvin - 273.15) * 10) / 10
}
