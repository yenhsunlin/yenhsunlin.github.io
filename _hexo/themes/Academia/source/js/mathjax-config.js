// Configure MathJax before the deferred library loads.
window.MathJax = {
    tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]'], ['$$', '$$']],
        tags: 'ams',
        tagSide: 'right'
    },
    startup: {
        // Only process page content, not navigation or the profile card.
        elements: ['.page']
    }
};

(function ($) {
    // Remove references to outgoing equations before PJAX replaces the DOM.
    $(document).on('pjax:beforeReplace', function () {
        if (typeof MathJax.typesetClear === 'function') {
            MathJax.typesetClear([document.querySelector('.page')]);
        }
    });

    $(document).on('pjax:end', function () {
        // If the library is still downloading, startup will process the new page.
        if (!MathJax.startup.promise) return;
        MathJax.startup.promise.then(function () {
            MathJax.typesetClear();
            MathJax.texReset();
            return MathJax.typesetPromise([document.querySelector('.page')]);
        }).catch(function (error) {
            console.error('MathJax could not typeset this page:', error);
        });
    });
})(jQuery);
