var log = (function () {
  var top = this;
  var ENTER = 1;
  var LEAVE = 0;
  var TAB = 4;
  var lastdir = LEAVE;
  var level = 0;
  var muted = true;
  function args2array(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
      result[i] = list[i];
    }
    return result;
  }
  function tabbed (/** arg 0: action, arg 1: format, arg 2-*: args */) {
    var args = args2array(arguments);
    var action = args[0];
    var format = args[1];
    var rest = args.slice(2);
    var first = Array(TAB * level).join(" ") + "[" + action + "] " + format;
    return [first].concat(rest);
  }
  function colored (/** arg 0: color, arg 1: format, arg 2-*: args */) {
    var args = args2array(arguments);
    var color = args[0];
    var format = args[1];
    var rest = args.slice(2);
    var first = "%c" + format;
    return [first, color].concat(rest);
  }
  function logit(coll) {
    if (!muted) {
      console.log.apply(console, coll);
    }
  }
  return {
    mute: function () {
      muted = true;
    },
    unmute: function() {
      muted = false;
    },
    enter: function () {
      var args = args2array(arguments);
      var c = colored.apply(this, ['color:white; background-color:darkblue'].concat(args));
      try {
        if (lastdir === ENTER) {
          level++;
        }
        var t = tabbed.apply(this, ["ENTER"].concat(c));
        logit(t);
      } finally {
        lastdir = ENTER;
      }
    },
    leave: function () {
      var args = args2array(arguments);
      var c = colored.apply(top, ['color:green; background-color:lightgray'].concat(args));
      try {
        if (lastdir === LEAVE) {
          level = Math.max(0, level - 1);
        }
        var t = tabbed.apply(this, ["LEAVE"].concat(c));
        logit(t);
      } finally {
        lastdir = LEAVE;
      }
    },
    info: function () {
      var args = args2array(arguments);
      var c = colored.apply(top, ['color:black; background-color:lightgray'].concat(args));
      var t = tabbed.apply(this, ["INFO"].concat(c));
      logit(t);
    },
    error: function () {
      var args = args2array(arguments);
      var c = colored.apply(top, ['color:red; background-color:lightgray'].concat(args));
      var t = tabbed.apply(this, ["ERROR"].concat(c));
      logit(t);
    }
  };
})();
