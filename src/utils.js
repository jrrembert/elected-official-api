// Simple attempt to normalize data by extending the native String object.
// Wouldn't normally play with native types like this, but it's convenient here.

String.prototype.capitalize = function() {
	var strSplit = this.split(" ");
	var newStr = "";

	for (var i = 0; i < strSplit.length; i++) {
		if (i === 0) {
			newStr += strSplit[i].charAt(0).toUpperCase() + strSplit[i].slice(1).toLowerCase();
		} else {
			newStr += " " + strSplit[i].charAt(0).toUpperCase() + strSplit[i].slice(1).toLowerCase();
		}
	}
	return newStr;
};

module.exports = String
