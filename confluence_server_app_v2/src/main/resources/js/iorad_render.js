AJS.toInit(function(){
    var $ioradEembedContainer = AJS.$('#iorad-embed-container');
    $ioradEembedContainer.html(LZString.decompressFromEncodedURIComponent($ioradEembedContainer.data('embed-code')));
});