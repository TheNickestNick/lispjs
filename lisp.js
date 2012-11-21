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

lispjs.parse = function(input) {
	var list = [];

	if (input[0] != '(')
		throw 'Expected "("';
	
	for(var i = 1; i < input.length; i++) {
		if (input[i] == ')')
			return list;
		else if (input[i] == '(') {
			var sub = lispjs.parse(input.slice(i));
			i += sub.length;
			list.push(sub);
		}
		else 
			list.push(input[i]);
	}
	
	throw 'Expected ")"';
};