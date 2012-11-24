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
	if (typeof input === 'string')
		input = lispjs.tokenize(input);

	var list = [];
	lispjs.parseinternal(input, 0, list);
	return list;
};

function evnironment(parent) {
	var symbols = {};

	this.get = function(sym) {
		var val = symbols[sym];
		if (typeof val == 'undefined' && parent)
			return parent.get(sym);
		return val;
	};
	
	this.set = function(sym, val) {
		symbols[sym] = val;
	};
};

var globals = new environment();

lispjs.eval = function(input) {
	if (typeof input == 'string')
		input = lispjs.parse(input);

	for(var i = 0; i < input.length; i++) {
		if (typeof input[i] != 'string') {
			
		}
		else {
		}
	}
};