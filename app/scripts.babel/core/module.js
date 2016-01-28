let LP = window.LP || {};

LP.module = function(name, fn) {
	if (typeof fn === "function") {
		return LP.module._createModule(window.LP, name, fn);		
	}
};

LP.module._createModule = function(ns, name, fn) {
	let parts = name.split(".");
	
	parts.forEach((part, i) => {
		if (parts.length === i + 1) {
			ns[part] = fn;	
		} else {
			ns[part] = ns[part] || {};
		}
		ns = ns[part];
	});
	return ns;
};