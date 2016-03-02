jQuery.fn.placeholder = function () {
    var i = document.createElement('input'),
		placeholdersupport = 'placeholder' in i;
    if (!placeholdersupport) {
        var inputs = jQuery(this);
        inputs.each(function () {
            var input = jQuery(this),
				text = input.attr('placeholder'),
				pdl = 0,
				height = input.outerHeight(),
				width = input.outerWidth(),
				placeholder = jQuery('<span class="phTips">' + text + '</span>');
            try {
                pdl = input.css('padding-left').match(/\d*/i)[0] * 1;
            } catch (e) {
                pdl = 5;
            }
            placeholder.css({ 'margin-left': -(width - pdl), 'height': height, 'line-height': height + "px", 'position': 'absolute', 'color': "#cecfc9", 'font-size': "14px" });
            placeholder.click(function () {
                input.focus();
            });
            if (input.val() != "") {
                placeholder.css({ display: 'none' });
            } else {
                placeholder.css({ display: 'inline' });
            }
            placeholder.insertAfter(input);
            input.keyup(function (e) {
                if (jQuery(this).val() != "") {
                    placeholder.css({ display: 'none' });
                } else {
                    placeholder.css({ display: 'inline' });
                }
            });
        });
    }
    return this;
};