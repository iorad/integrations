ioradWebWidget.config.uservoice = (function (uv, apiKeys) {
  uv.consumerPublic = apiKeys.consumerPublic || '';
  uv.consumerSecret = apiKeys.consumerSecret || '';
  return uv;
})(ioradWebWidget.config.uservoice || {}, window.ioradWebWidgetApiKeys || {});
