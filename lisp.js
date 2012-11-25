function Symbol(name) { this.name = name; };

function Evnironment(parent) {
	var symbols = {};

	this.get = function(sym) {
		return val || (parent && parent.get(sym));
	};
	
	this.set = function(sym, val) {
		symbols[sym] = val;
	};
};

function atom(str) {
	if (str[0] === '"' && str[str.length - 1] == '"')
		return str.substring(1, str.length - 2);

	return parseFloat(str) || new Symbol(str);
};

var lispjs = new (function(){
	function tokenize(str) {
		return str
			.replace(/\(/g, ' ( ')
			.replace(/\)/g, ' ) ')
			.split(' ')
			.filter(function (c) {
				return c != '' && c != ' ';
			});
	};
	
	function parse(tokens) {
		if (tokens.length === 0)
			throw new SyntaxError('Unexpected end of token stream when parsing expression');
			
		var current = tokens.shift();
		
		if (current === '(') {
			var list = [];

			while (tokens[0] !== ')') {
				list.push(parse(tokens));
			}
			
			tokens.shift();
			return list;
		}
		else if (current === ')') {
			throw new SyntaxError('Unmatched )');
		}
		else {
			return atom(current);
		}
	};
	
	function evaluate() {
	};
	
	this.parse = parse;	
	this.tokenize = tokenize;
	this.evaluate = evaluate;
})();