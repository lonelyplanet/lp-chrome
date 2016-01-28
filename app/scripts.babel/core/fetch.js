LP.module("core.fetch", function(url) {
	return new Promise((resolve) => {
		window.fetch(url).then((response) => {
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
});