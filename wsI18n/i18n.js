function __getObjectValue(name, obj) {
	var val, arr, i, finalKey;
	if (!name || !obj)
		return null;
	name += '';
	arr = name.split('.');
	finalKey = arr.pop();
	for (i = 0; i < arr.length; i++) {
		obj = obj[arr[i]];
		if (!obj) {
			return null;
		}
	}
	if (!obj.hasOwnProperty(finalKey) || (typeof obj[finalKey] == 'object')) {
		return null;
	}
	return obj[finalKey];
}

function geti18n(i18n_name, page_name) {
	var page = i18n;
	if (!i18n) {
		return i18n_name;
	}
	if (page_name) {
		var page_levels = page_name.split(".");
		if ((page_levels.length > 1)) {
			if (page_levels[0] == 'i18n') {
				page_levels.shift();
			}
			for (var i = 0; i < page_levels.length; i++) {
				if ((page.hasOwnProperty(page_levels[i]))) {
					page = page[page_levels[i]];
				} else {
					break;
				}
			}
		} else {
			if (i18n.hasOwnProperty(page_name)) {
				page = i18n[page_name];
			}
		}
	}

	i18n_value = (page_name && __getObjectValue(i18n_name, page))
			|| __getObjectValue(i18n_name, i18n.common)
			|| __getObjectValue(i18n_name, i18n);

	if (!i18n_value) {
		i18n_value = i18n_name;
	}
	return i18n_value;
}

function localizePage(page_name, elem) {

	var i18nelems;
	if (!elem) {
		elem = document;
		var title = geti18n("PRODUCT_NAME", page_name);
		if (title) {
			document.title = title;
		}
		i18nelems = $('*[i18n], *[data-i18n]');

	} else {
		i18nelems = elem;
	}

	i18nelems.each(function() {
		var $this = $(this);
		var i18n_name = $this.attr('data-i18n') || $this.attr('i18n');
		var i18n_value = null;
		if (i18n_name && i18n) {
			i18n_value = geti18n(i18n_name, page_name);
		}
		var tag_name = $this.get(0).tagName;
		if (i18n_value !== null) {
			switch (tag_name) {
			case 'INPUT':
				var type_name = $this.attr('type').toUpperCase();
				if (type_name == 'BUTTON' || type_name == 'SUBMIT'
						|| type_name == 'RESET' || type_name == 'HIDDEN') {
					$this.attr('value', i18n_value);
				} else if (type_name == 'CHECKBOX' || type_name == 'RADIO') {
					$this.after(i18n_value);
				}
				break;
			case 'IMG':
				$this.attr('title', i18n_value);
				break;
			case 'TITLE':
				document.title = i18n_value;
				$(this).html(i18n_value);
				break;
			default:
				$this.html(i18n_value);
				break;
			}
		}

	});
	$('*[title]').each(function() {
		var localizedTitle = geti18n($(this).attr('title'), page_name);
		$(this).attr('title', localizedTitle);
	});

	$('*[placeholder]').each(function() {
		var $this = $(this);
		var id = $this.attr('id');
		if (id) {
			var labels = $('label[for=' + id + ']');
			labels.each(function() {
				if ($(this).css('position') == 'absolute') {
					if ($(this).parent().is('span')) {
						$(this).unwrap();
						$(this).remove();
						$this.unbind('blur');
						$this.unbind('focus');
					}
				}
			});
		}

		var i18n_name = $this.attr('placeholder');
		i18n_value = geti18n(i18n_name, page_name);
		$this.attr("placeholder", i18n_value);
		$this.placeholder();
	});
}