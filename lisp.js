function Symbol(name) { this.name = name; };

function Environment(parent, symbols) {
	this.symbols = symbols || {};

	this.get = function(name) {
		return this.symbols[name] || (parent && parent.get(name));
	};
	
	this.set = function(name, val) {
		this.symbols[name] = val;
	};
};

function atom(str) {
	if (str[0] === '"' && str[str.length - 1] == '"')
		return str.substring(1, str.length - 1);

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
	
	function evaluate(ast, env) {
		if (ast instanceof Symbol) {
			return env.get(ast.name);
		}
		
		if (!(ast instanceof Array)) {
			return ast;
		}
			
		if (ast[0] instanceof Symbol) {
			if (ast[0].name === 'define') {
				var symbol = ast[1];
				var value = evaluate(ast[2], env);
				env.set(symbol.name, value);
				return value;
			}
			else if (ast[0].name === 'if') {
				return evaluate(ast[1], env) 
					 ? evaluate(ast[2], env) 
					 : evaluate(ast[3], env);
			}
			else if (ast[0].name === 'lambda') {
				var argSymbols = ast[1];
				var body = ast[2];
				
				return function() {
					var callEnv = new Environment(env);
					
					for (var i = 0; i < arguments.length; i++)
						callEnv.set(argSymbols[i].name, arguments[i]);

					return evaluate(body, callEnv);
				};
			}
		}
		
		var list = [];
		for(var i = 0; i < ast.length; i++)
			list.push(evaluate(ast[i], env));
		
		var procedure = list.shift();
		return procedure.apply({ env: env }, list);
	};
	
	this.parse = parse;	
	this.tokenize = tokenize;
	this.evaluate = evaluate;
	
	var globals = new Environment(null, window);
	globals.set('+', function(x, y) { return x + y; });
	globals.set('-', function(x, y) { return x - y; });
	globals.set('*', function(x, y) { return x * y; });
	globals.set('/', function(x, y) { return x / y; });
	globals.set('=', function(x, y) { return x == y; });
	globals.set('>', function(x, y) { return x > y; });
	globals.set('<', function(x, y) { return x < y; });

	this.globals = globals;
	this.interpret = function(str) {
		return evaluate(parse(tokenize(str)), globals);
	};
})();