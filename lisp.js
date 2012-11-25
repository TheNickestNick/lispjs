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

	return new Number(str) || new Symbol(str);
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
	
	function parse(ast) {
		if (ast.length === 0)
			throw new SyntaxError('Unexpected end of AST when parsing expression');
			
		var current = ast.shift();
		
		if (current === '(') {
			var list = [];

			while (ast[0] !== ')') {
				list.push(parse(ast.shift()));
			}
		}
		else if (current === ')') {
			throw new SyntaxError('Unmatched )');
		}
		else {
			return atom(current);
		}
	};
	
	function evalulate() {
	};
	
	this.parse = parse;
	this.tokenize = tokenize;
	this.evaluate = evaluate;
});