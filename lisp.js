var lispjs = {};

lispjs.tokenize = function(input) {
	return input
		.replace(/\(/g, ' ( ')
		.replace(/\)/g, ' ) ')
		.split(' ')
		.filter(function (c) {
			return c != '' && c != ' ';
		});
};

lispjs.parseinternal = function(input, i, list) {
	if (input[i] != '(')
		throw 'Expected "("';

	for(i = i + 1; i < input.length; i++) {
		if (input[i] == ')')
			return i;
		else if (input[i] == '(') {
			var sub = [];
			i = lispjs.parseinternal(input, i, sub);
			list.push(sub);
		}
		else 
			list.push(input[i]);		
	}

	throw 'Expected ")"';
}

lispjs.parse = function(input) {
	var list = [];
	lispjs.parseinternal(input, 0, list);
	return list;
};