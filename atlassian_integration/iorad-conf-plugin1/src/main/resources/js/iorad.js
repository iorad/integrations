/**
 * editor embedded js lib
 *
 * This lib should be included any web page leveraging iorad editor.
 *
 * How to use
 * ----------
 *
 * Include this lib into your web page: (note that jQuery is required).
 *
 * ```
 * <script type="text/javascript" src="jquery.js"></script>
 *
 * <script type="text/javascript" src="//iorad.com/server/assets/js/iorad.js"></script>
 * ```
 *
 * For cfdev, prod mode, use the right domain:
 *
 * cfdev mode:
 *
 * ```
 * <script type="text/javascript" src="//localhost:8001/server/assets/js/iorad.js"></script>
 * ```
 *
 * prod mode:
 *
 * ```
 * <script type="text/javascript" src="//test.iorad.com/server/assets/js/iorad.js"></script>
 * ```
 *
 * And from your web page:
 *
 * iorad.init(readyCallback): to use default variables
 *
 * iorad.init(options, readyCallback): to override default variables, for example:
 *
 * ```
 * iorad.init({env: 'cfdev'}, function() {
 *     //iorad is ready to use now
 * });
 * ```
 *
 * iorad.createTutorial(): to create a new tutorial
 * iorad.editTutorial(tutorialId): to edit an existing tutorial by its id
 * iorad.getPlayerUrl(uid, tutorialId, tutorialTitle): to get player url
 * iorad.extractTutorialInfo(playerUrl): to extract tutorialParams from provided player url
 * iorad.getEmbeddedPlayerUrl(uid, tutorialId, tutorialTitle): to get iframe embedded player url
 *
 * Events:
 *
 * iorad.on(event_name, handler)
 *
 * iorad.off(event_name)
 *
 * iorad.once(event_name, handler)
 *
 *
 * Available Events Listeners:
 *
 * iorad.on('editor:ready', function() {}); when the editor is ready (initialized)
 * iorad.on('editor:close', function(tutorialParams) {}); when the editor is closed
 *
 *
 * tutorialParams must have the following keys:
 *
 * - base_url
 * - uid
 * - tutorialId
 * - tutorialTitle
 */

var _ = _ || ({
    isObject: function (obj) {
        return obj === Object(obj);
    },
    isFunction: function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    isString: function (obj) {
        return typeof obj === 'string' || obj instanceof String;
    },
    defaults: function (obj1, obj2) {
        var obj3 = {},
            attrname;
        for (attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },
    clone: function (obj) {
        if (!_.isObject(obj)) {
            return obj;
        }
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    },
    each: function (obj, iterator, context) {
        if (obj === null) {
            return obj;
        }
        var i = 0,
            length;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) {
                    return;
                }
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) {
                    return;
                }
            }
        }
        return obj;
    },
    extend: function (obj) {
        _.each(Array.prototype.slice.call(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }
});

var Backbone = Backbone || ({
    triggerEvents: function (events, args) {
        var ev, i = -1,
            l = events.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx);
                }
                return;
            case 1:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1);
                }
                return;
            case 2:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1, a2);
                }
                return;
            case 3:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                }
                return;
            default:
                while (++i < l) {
                    (ev = events[i]).callback.apply(ev.ctx, args);
                }
                return;
        }
    },
    eventsApi: function (obj, action, name, rest) {
        if (!name) {
            return true;
        }

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        // Handle space separated event names.
        if (/\s+/.test(name)) {
            var names = name.split(/\s+/);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    },
    Events: {
        on: function (name, callback, context) {
            if (!Backbone.eventsApi(this, 'on', name, [callback, context]) || !callback) {
                return this;
            }
            if (!this._events) {
                this._events = {};
            }
            //this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({
                callback: callback,
                context: context,
                ctx: context || this
            });
            return this;
        },
        trigger: function (name) {
            if (!this._events) {
                return this;
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!Backbone.eventsApi(this, 'trigger', name, args)) {
                return this;
            }
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) {
                Backbone.triggerEvents(events, args);
            }
            if (allEvents) {
                Backbone.triggerEvents(allEvents, arguments);
            }
            return this;
        }
    }
});


(function(window, $, _, Backbone, undefined) {

    var iorad = window.iorad = {};

    //default variables

    var env = 'live', // cfdev, prod, or live; default: live
        customBaseUrl = ''; //baseUrl when this variable is set (via init)


    function getBaseUrl() {
        if (customBaseUrl !== '') {
            return customBaseUrl;
        }
        var baseUrl;
        switch(env) {
            case 'cfdev':
                baseUrl = '//localhost:8001';
                break;
            case 'prod':
                baseUrl = '//test.iorad.com';
                break;
            default:
                baseUrl = '//www.iorad.com';
                break;
        }
        return baseUrl;
    }

    function newTutorialEditorUrl() {
        return getBaseUrl() + '/server/?a=app.editor&data=0&src=iframe';
    }


    function existingTutorialEditorUrl(tutorialParams) {
        return getBaseUrl() + '/server/?a=app.editor&data=0&module=' + tutorialParams.tutorialId + '&uid=' + tutorialParams.uid;
    }


    _.extend(iorad, Backbone.Events, {
        /**
         * Creates a new tutorial.
         */
        createTutorial: function() {
            this.trigger('editor:create');
        },
        /**
         * Edits an existing tutorial.
         *
         * @param tutorialParams
         */
        editTutorial: function(tutorialParams) {
            this.trigger('editor:edit', tutorialParams);
        },
        /**
         * Gets player url.
         *
         * @param uid
         * @param tutorialId
         * @param tutorialTitle
         * @returns {string}
         */
        getPlayerUrl: function(uid, tutorialId, tutorialTitle) {
            return [getBaseUrl(), uid, tutorialId, tutorialTitle].join('/')
        },
        /**
         * Extracts tutorial params from provided player url.
         *
         * @param playerUrl
         *
         * @return object with base_url, uid, tutorialId, tutorialTitle
         */
        extractTutorialParams: function(playerUrl) {
            var splits = playerUrl.split('/'),
                len = splits.length;

            return {
                base_url: splits[len-4],
                uid: splits[len-3],
                tutorialId: splits[len-2],
                tutorialTitle: splits[len-1]
            }
        },
        /**
         * Gets embedded player url.
         *
         * @param uid
         * @param tutorialId
         * @param tutorialTitle
         * @returns {string}
         */
        getEmbeddedPlayerUrl: function(uid, tutorialId, tutorialTitle) {
            var playerUrl = this.getPlayerUrl(uid, tutorialId, tutorialTitle);
            return '<iframe src="' + playerUrl + '" width="100%" scrolling="no" height="500px" style="border:0px;" allowfullscreen="true"></iframe>';
        }
    });

    //event handlers

    /**
     * Creates a new tutorial
     *
     * This function will create an overlayed full width + full height iframe for editor.
     */
    iorad.on('editor:create', function() {
        //console.log('create a new tutorial now...');
        $('#iorad-editor-wrapper').empty();
        $('#iorad-editor-wrapper').append('<iframe id="iorad-editor" src="'+ newTutorialEditorUrl() +'"></iframe>');
    });

    iorad.on('editor:edit', function(tutorialParams) {
        //console.log('edit an existing tutorial now...' + tutorialId);
        $('#iorad-editor-wrapper').empty();
        $('#iorad-editor-wrapper').append('<iframe id="iorad-editor" src="'+ existingTutorialEditorUrl(tutorialParams) +'"></iframe>');
    });


    /**
     * initializes iorad sdk.
     *
     * iorad.init(options, readyCallback); to override default options
     *
     * or:
     *
     * iorad.init(readyCallback); to use default options
     *
     *
     * @param opt_options pass `env` or `domain` for custom base url.
     * @param readyCallback
     */
    iorad.init = function(opt_options, readyCallback) {
        //override defaults value

        readyCallback = _.isFunction(opt_options) ? opt_options : readyCallback;

        if (_.isObject(opt_options)) {
            env = opt_options.env || env;
            if (opt_options.domain && opt_options.domain !== '') {
                env = 'custom';
                customBaseUrl = opt_options.domain;
            }
        }

        //load additional js, css resources

        var cssLink = getBaseUrl() + '/server/assets/css/iorad.css';

        $('head').append('<link rel="stylesheet" type="text/css" href="'+ cssLink +'">');


        //init iframe wrapper
        $(document).ready(function() {
            $('body').append('<div id="iorad-editor-wrapper"></div>');

            //init message listeners
            window.addEventListener('message', function(e) {
                if (!e.origin.match(getBaseUrl() +'$')) {
                    return
                }
                //expect event.data is a command object with following keys:
                //type:api
                //command:
                //value:
                if (e.data.type === 'api') {

                    if (e.data.command === 'editor:close') {
                        $('#iorad-editor').remove();
                    }

                    e.data.value ? iorad.trigger(e.data.command, e.data.value): iorad.trigger(e.data.command);
                }
            });

            readyCallback.call(iorad);
        });

    };


})(window, jQuery, _, Backbone);