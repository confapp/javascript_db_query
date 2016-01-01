(function(root) {
	var DO_BREAK = {};

	root.getLatestConfappDatabase = function(versions_url, callback, thisArg) {
		function onDataFetched(history) {
			var current = history.current,
				info;
			each(history.versions, function(version_info) {
				if(version_info.version === current) {
					info = {
						databaseURL: version_info.json_url,
						mapImageDirectory: version_info.mapImageDirectory,
						annotationImageDirectory: version_info.annotationImageDirectory
					};
					return DO_BREAK;
				}
			});
			callback.call(thisArg || this, info);
		}

		xhr('GET', versions_url, false, function(response) {
			this._onDataFetched(JSON.parse(response));
		}, function(err) {
			throw(err);
		}, this);
	};

	function xhr(type, url, data, success, error, thisArg) {
		var XHR = root.XMLHttpRequest || ActiveXObject;
		var request = new XHR('MSXML2.XMLHTTP.3.0');
		request.open(type, url, true);
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status >= 200 && request.status < 300) {
					success.call(thisArg, request.response);
				} else {
					error.call(thisArg, request);
				}
			}
		};
		try {
			request.send(data);
		} catch(e) {
			//console.error(e);
		}
	}

	function each(obj, fn, thisArg) {
		if(!obj) { return; }
		var i, length = obj.length;
		if (length === +length) {
			for (i = 0; i < length; i++) {
				if(fn.call(thisArg, obj[i], i, obj) === DO_BREAK) {
					return;
				}
			}
		} else {
			i = 0;
			for(var key in obj) {
				if(obj.hasOwnProperty(key)) {
					if(fn.call(thisArg, obj[key], key, obj) === DO_BREAK) {
						break;
					}
				}
			}
		}
	}
}(this));
