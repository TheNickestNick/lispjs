var lispjs = {};

lispjs.tokenize = function(input) {
	return input
		.replace('(', ' ( ')
		.replace(')', ' ) ')
		.split(' ')
		.filter(function (c) {
			return c != '';
		});
};