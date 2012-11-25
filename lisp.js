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
	
	function evaluate(ast, evn) {
		if (ast instanceof Symbol) {
			return env.get(ast.name);
		}
		
		if (typeof ast === 'string') {
			return ask;
		}
		
		if (ast[0] === 'define') {
			var name = ast[1];
			var expression = ast[2];
			env.set(name, evaluate(expression, env));
		}
		else if (ast[0] === 'lambda') {
			var argNames = ast[1];
			var body = ast[2];
			
			return function() {
				var callEnv = new Environment(env);
				
				for (var i = 0; i < arguments.length; i++)
					callEnv.set(argNames[i], arguments[i]);

				return evaluate(body, callEnv);
			};
		}
		else {
			var list = [];
			for(var i = 0; i < ast.length; i++) {
				list.push(evaluate(ast[i], env));
			};
			
			var procedure = list.unshift();
		};
	};
	
	this.parse = parse;	
	this.tokenize = tokenize;
	this.evaluate = evaluate;
	
	this.globals = new Environment();
	
	this.interpret = function(str) {
		return evaluate(parse(tokenize(str)), this.globals);
	};
})();