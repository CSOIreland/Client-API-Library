/*******************************************************************************
API - Library 
*******************************************************************************/
// Init & Set
var api = api || {};

/*******************************************************************************
API - Library - Spinner
*******************************************************************************/
api.spinner = {};
api.spinner.count = 0;

api.spinner.progress = {};
api.spinner.progress.instance = null;
api.spinner.progress.timeout = 0;

/**
 * Show the Overlay and start the Spinner
 */
api.spinner.start = function () {
  if (!api.spinner.count++) {
    $("#spinner").show();
  }
};

/**
 * Hide the Overlay and stop the Spinner
 */
api.spinner.stop = function () {
  if (api.spinner.count) {
    // Do not go negative
    api.spinner.count--;
  }

  if (!api.spinner.count) {
    if (api.spinner.progress.instance) {
      // End the progress bar
      api.spinner.progress.stop();

      // Close the spinner after 1 second to show 100% in the progress bar
      setTimeout(function () {
        $("#spinner").fadeOut('slow');
      }, 1000);
    }
    else {
      // Close the spinner immediatelly
      $("#spinner").fadeOut('slow');
    }
  }
};

/**
 *  Start the iterative Timeout method for the progress bar
 */
api.spinner.progress.start = function (progressTimeout) {
  if (progressTimeout) {
    clearTimeout(api.spinner.progress.instance);

    // Set progress timeout
    api.spinner.progress.timeout = progressTimeout;

    // Set progress to 0%
    $("#spinner .progress").find("[name=bar]").css('width', '1%').attr('aria-valuenow', 1);
    $("#spinner .progress").find("[name=percentage]").text("1%");
    $("#spinner .progress").show();

    // Initiate the progress by setting the timeout
    api.spinner.progress.setTimeout();
  }
};

/**
 *  Stop the iterative Timeout method for the progress bar
 */
api.spinner.progress.stop = function () {
  clearTimeout(api.spinner.progress.instance);

  // Set progress to 100%
  $("#spinner .progress").find("[name=bar]").css('width', '100%').attr('aria-valuenow', 100);
  $("#spinner .progress").find("[name=percentage]").text("100%");
  $("#spinner .progress").fadeOut('slow');
};

/**
 * Get the (expected) timeout for the progress bar
 */
api.spinner.progress.getTimeout = function (unitsToProcess, unitsPerSecond) {
  var timeout = unitsToProcess / unitsPerSecond; // Get the total time in seconds
  timeout = timeout / 100 * 1 * 1000; // Get 1% of the time in mseconds
  return timeout;
};

/**
 *  Set the iterative Timeout method for the progress bar
 */
api.spinner.progress.setTimeout = function () {
  // Add an incremental safety margin
  api.spinner.progress.timeout = Math.ceil(api.spinner.progress.timeout + api.spinner.progress.timeout / 100 * 0.5);

  api.spinner.progress.instance = setTimeout(function () {
    // Never display 100% as it may need longer than expected to complete
    var percentage = Math.min(parseInt($("#spinner .progress").find("[name=bar]").attr('aria-valuenow')) + 1, 99);
    $("#spinner .progress").find("[name=bar]").css('width', percentage + '%').attr('aria-valuenow', percentage);
    $("#spinner .progress").find("[name=percentage]").text(percentage + "%");
    // Loop in 
    api.spinner.progress.setTimeout();
  }, api.spinner.progress.timeout);
};

/*******************************************************************************
API - Library - Content
*******************************************************************************/
api.content = {};
api.content.params = {};

/**
 * Get a Parameter
 * @param {*} pKey 
 */
api.content.getParam = function (pKey) {
  return api.content.params[pKey];
};

/**
 * Load a Relative URL into a Container
 * @param {*} pSelectorContainer 
 * @param {*} pRelativeURL 
 * @param {*} pParams 
 * @param {*} pAppend 
 */
api.content.load = function (pSelectorContainer, pRelativeURL, pParams, pAppend) {
  // Default parameters
  pParams = pParams || {};
  pAppend = pAppend || false;

  // Validate the Relative URL
  var uri = new URI(pRelativeURL);
  if (uri.is("relative") === false)
    return;

  /**
   * Load the URL straight
   * Set async to false to enforce script serialization
   * https://github.com/jquery/jquery/issues/4213
   */
  $.ajax({
    url: pRelativeURL,
    async: false,
    success: function (response) {
      api.content.params = pParams;
      if (pAppend)
        $(pSelectorContainer).append(response).promise().done(function () {
          api.content.params = {};
        });
      else
        $(pSelectorContainer).empty().html(response).promise().done(function () {
          api.content.params = {};
        });
    }
  });
};

/**
 * Navigate to a Relative URL by Selector
 * @param {*} pNavSelector 
 * @param {*} pRelativeURL 
 * @param {*} pNav_link_SelectorToHighlight 
 * @param {*} pNav_menu_SelectorToHighlight 
 */
api.content.navigate = function (pNavSelector, pRelativeURL, pNav_link_SelectorToHighlight, pNav_menu_SelectorToHighlight) {
  // Default parameters
  pNav_link_SelectorToHighlight = pNav_link_SelectorToHighlight || null;
  pNav_menu_SelectorToHighlight = pNav_menu_SelectorToHighlight || null;

  // Validate the Relative URL
  var uri = new URI(pRelativeURL);
  if (uri.is("relative") === false)
    return;

  $(pNavSelector).click(function (e) {
    e.preventDefault();

    /**
     * Load the URL with smooth transition
     * Set async to false to enforce script serialization
     * https://github.com/jquery/jquery/issues/4213
     */
    $.ajax({
      url: pRelativeURL,
      async: false,
      success: function (response) {
        $('#body').hide().empty().html(response).fadeIn();
      }
    });

    // "show" is a Bootstrap property
    $("#navigation").find("*").removeClass("show");
    // "active" is a Bootstrap property
    $("#navigation").find("*").removeClass("active");

    if (pNav_link_SelectorToHighlight)
      // "active" is a Bootstrap property
      $(pNav_link_SelectorToHighlight).addClass("active");

    if (pNav_menu_SelectorToHighlight) {
      // "active" is a Bootstrap property
      $(pNav_menu_SelectorToHighlight).addClass("active");
    }
  });
};

/**
 * Go to a Relative URL by Parameters
 * @param {*} pRelativeURL 
 * @param {*} pNav_link_SelectorToHighlight 
 * @param {*} pNav_menu_SelectorToHighlight 
 * @param {*} pParams 
 */
api.content.goTo = function (pRelativeURL, pNav_link_SelectorToHighlight, pNav_menu_SelectorToHighlight, pParams) {
  // Default parameters
  pNav_link_SelectorToHighlight = pNav_link_SelectorToHighlight || null;
  pNav_menu_SelectorToHighlight = pNav_menu_SelectorToHighlight || null;
  pParams = pParams || {};

  // Validate the Relative URL
  var uri = new URI(pRelativeURL);
  if (uri.is("relative") === false)
    return;

  /**
   * Load the URL with smooth transition
   * Set async to false to enforce script serialization
   * https://github.com/jquery/jquery/issues/4213
   */
  $.ajax({
    url: pRelativeURL,
    async: false,
    success: function (response) {
      api.content.params = pParams;
      $('#body').hide().empty().html(response).fadeIn().promise().done(function () {
        api.content.params = {};
      });
    }
  });

  // "show" is a Bootstrap property
  $("#navigation").find("*").removeClass("show");
  // "active" is a Bootstrap property
  $("#navigation").find("*").removeClass("active");

  if (pNav_link_SelectorToHighlight)
    // "active" is a Bootstrap property
    $(pNav_link_SelectorToHighlight).addClass("active");

  if (pNav_menu_SelectorToHighlight) {
    // "active" is a Bootstrap property
    $(pNav_menu_SelectorToHighlight).addClass("active");
  }
};

/*******************************************************************************
API - Library - Ajax
*******************************************************************************/
api.ajax = {};

/**
 * Execute an AJAX callback function
 * @param {*} pFunction 
 * @param {*} pResponse 
 * @param {*} pParams 
 */
api.ajax.callback = function (pFunction, pResponse, pParams) {
  // Default parameters
  pResponse = pResponse || null;
  pParams = pParams || {};

  // Context is windows in a browser
  var context = window;

  // Initialise callbackFunction
  var callbackFunction = "";

  // Look for the function within the scope
  callbackFunction = context[pFunction];
  // Run a function that is not namespaced
  if (typeof callbackFunction === 'function') {
    if (jQuery.isEmptyObject(pParams))
      return callbackFunction(pResponse);
    else
      return callbackFunction(pResponse, pParams);
  }

  // Retrieve the namespaces of the function
  // e.g Namespaces of "MyLib.UI.Read" would be ["MyLib","UI"]
  var namespaces = pFunction.split(".");

  // Retrieve the real name of the function
  // e.g Namespaces of "MyLib.UI.Read" would be Read
  var functionName = namespaces.pop();

  // Iterate through every namespace to access the one that has the function to execute. 
  // For example with the Read fn "MyLib.UI.SomeSub.Read"
  // Loop until context will be equal to SomeSub
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }

  if (context) {
    // Get the function in the namespaces
    callbackFunction = context[functionName];

    if (jQuery.isEmptyObject(pParams))
      return callbackFunction(pResponse);
    else
      return callbackFunction(pResponse, pParams);
  }

  return false;
};

/**
 * Load a configuration file
 * @param {*} pUrl
 * @param {*} pCallback
 * @param {*} pAjaxParams
 */
api.ajax.config = function (pUrl, pCallback, pAjaxParams) {
  // Default AJAX parameters
  pAjaxParams = pAjaxParams || {};
  pAjaxParams.method = pAjaxParams.method || 'GET';
  pAjaxParams.dataType = pAjaxParams.dataType || 'json';
  pAjaxParams.jsonp = pAjaxParams.jsonp || false; // Fix for "??" JQuery placeholder
  pAjaxParams.timeout = pAjaxParams.timeout || 60000;
  pAjaxParams.async = pAjaxParams.async || false;

  ajaxParams = {
    url: pUrl,
    success: function (response) {
      pCallback(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Log the issue rather than popping it in a Bootstrap modal because the document may not be ready yet
      console.log("An Internal Server has occurred: the configuration file \"" + pUrl + "\" is missing or invalid.");
    }
  };

  // Merge ajax parameters
  $.extend(ajaxParams, pAjaxParams);
  // Run the Ajax call
  $.ajax(ajaxParams);
};

/*******************************************************************************
API - Library - Ajax - JSON-RPC
*******************************************************************************/
api.ajax.jsonrpc = {};

/**
 * Execute an Ajax Request with a JSON-RPC protocol
 * @param {*} pAPI_URL 
 * @param {*} pAPI_Method 
 * @param {*} pAPI_Params 
 * @param {*} callbackFunctionName_onSuccess 
 * @param {*} callbackParams_onSuccess 
 * @param {*} callbackFunctionName_onError 
 * @param {*} callbackParams_onError 
 * @param {*} pAJAX_Params 
 */
api.ajax.jsonrpc.request = function (pAPI_URL, pAPI_Method, pAPI_Params, callbackFunctionName_onSuccess, callbackParams_onSuccess, callbackFunctionName_onError, callbackParams_onError, pAJAX_Params) {
  // Default API parameters
  pAPI_Params = pAPI_Params || {};

  // Default callback functions
  callbackFunctionName_onSuccess = callbackFunctionName_onSuccess || null;
  callbackFunctionName_onError = callbackFunctionName_onError || null;

  // Default callback parameters
  callbackParams_onSuccess = callbackParams_onSuccess || null;
  callbackParams_onError = callbackParams_onError || null;

  // Default AJAX parameters
  pAJAX_Params = pAJAX_Params || {};
  pAJAX_Params.method = pAJAX_Params.method || 'POST';
  pAJAX_Params.dataType = pAJAX_Params.dataType || 'json';
  pAJAX_Params.jsonp = pAJAX_Params.jsonp || false; // Fix for "??" JQuery placeholder
  pAJAX_Params.timeout = pAJAX_Params.timeout || 180000;
  // Decide to simulate a sync behaviour
  var simulateSync = pAJAX_Params.async === undefined ? false : !pAJAX_Params.async;
  // Override to force aSync ajax even during Sync simulation
  pAJAX_Params.async = true;

  // Set the Call ID
  var callID = Math.floor(Math.random() * 999999999) + 1;

  // Set the Data to pass into the Ajax call
  var data4Ajax = {
    "jsonrpc": '2.0',
    "method": pAPI_Method,
    "params": pAPI_Params,
    "id": callID
  };

  // Extend AJAX Parameters
  var extendedAJAXParams = {
    url: pAPI_URL,
    data: JSON.stringify(data4Ajax),
    xhrFields: { withCredentials: true },
    success: function (response) {
      // Validate the JSON-RPC Call ID
      if (pAJAX_Params.dataType == 'json' && response.id != callID) {
        // Pop the exception in the Bootstrap Modal
        api.modal.exception("An invalid JSON-RPC Identifier has been detected. Please try again.");
        return;
      }

      if (response.error) {
        // Init the erro output
        var errorOutput = null;

        // Check response.error.data exist
        if (response.error.data) {
          // Format the structured data, either array or object
          if (($.isArray(response.error.data) && response.error.data.length)
            || ($.isPlainObject(response.error.data) && !$.isEmptyObject(response.error.data))) {
            errorOutput = $("<ul>", {
              class: "list-group"
            });
            $.each(response.error.data, function (_index, value) {
              var error = $("<li>", {
                class: "list-group-item",
                html: value.toString()
              });
              errorOutput.append(error);
            });
          } else
            // Plain error
            errorOutput = response.error.data;
        } else {
          // Get the simple message otherwise
          errorOutput = response.error.message;
        }

        // Pop the error in the Bootstrap Modal
        api.modal.error(errorOutput);

        if (callbackFunctionName_onError) {
          api.ajax.callback(callbackFunctionName_onError, response.error, callbackParams_onError);
        }
      } else if (response.result !== undefined) {
        // Check if the response.result property exist
        if (callbackFunctionName_onSuccess)
          api.ajax.callback(callbackFunctionName_onSuccess, response.result, callbackParams_onSuccess);
      }
      else api.modal.exception("An unexpected error has occurred. Please try again.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (callbackFunctionName_onError) {
        api.ajax.callback(callbackFunctionName_onError, null, callbackParams_onError);
      }
      else if (errorThrown == "Unauthorized") {
        // Silent response when unauthorized authentication
      }
      else {
        // Pop the exception in the Bootstrap Modal
        api.modal.exception("A Server or Network Error has occurred. Please try again.");
      }
    },
    complete: function () {
      // Simulate sync behaviour
      if (simulateSync)
        api.spinner.stop();

      // Stop the nav loader
      $("#nav-loader").removeClass('text-yellow fa-spin').addClass('text-navbar');
      $("body").css("cursor", "default");
    }
  }

  // Merge pAJAX_Params into extendedAJAXParams
  $.extend(extendedAJAXParams, pAJAX_Params);

  try {
    // Start the nav loader
    $("#nav-loader").removeClass('text-navbar').addClass('text-yellow fa-spin');
    $("body").css("cursor", "progress");

    // Simulate sync behaviour
    if (simulateSync)
      api.spinner.start();
    // Extend the session if any
    api.cookie.session.extend();

    // Make the Ajax call
    return $.ajax(extendedAJAXParams);
  } catch (error) {
    console.log(error)
    // Pop the exception in the Bootstrap Modal
    api.modal.exception("An unhandled Ajax exception has occurred. Please try again.");
    return false;
  }
};

/*******************************************************************************
API - Library - Modal
*******************************************************************************/
api.modal = {};

/**
 * Pop a Confirm Modal in Bootstrap
 * @param {*} pMessage 
 * @param {*} pCallbackMethod 
 * @param {*} pCallbackParams 
 */
api.modal.confirm = function (pMessage, pCallbackMethod, pCallbackParams) {
  // Set the body of the Modal - Empty the container first
  $("#modal-confirm").find(".modal-body > p").empty().html(pMessage);

  $("#modal-confirm").find("[name=confirm]").once("click", function () {
    // Must wait for the async transition to finsh before invoking the callback function that may be a cascade confirm
    $("#modal-confirm").modal('hide').delay(100).queue(function () {
      // https://stackoverflow.com/questions/10860171/run-function-after-delay
      pCallbackMethod(pCallbackParams);
      $(this).dequeue();
    });
  });

  // Force the modal to re-initialise before displaying in case of cascade confirm modals
  $("#modal-confirm").modal();
};

/**
 * Pop a Success Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.success = function (pMessage) {

  // Set the body of the Modal
  $("#modal-success").find(".modal-body > p").empty().html(pMessage);

  // Display the Modal
  $("#modal-success").modal();
};

/**
 * Pop an Error Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.error = function (pMessage) {

  // Set the body of the Modal
  $("#modal-error").find(".modal-body > p").empty().html(pMessage);

  // Display the Modal
  $("#modal-error").modal();
};

/**
 * Pop an Information Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.information = function (pMessage) {

  // Set the body of the Modal
  $("#modal-information").find(".modal-body > p").empty().html(pMessage);

  // Display the Modal
  $("#modal-information").modal();
};

/**
 * Pop an Error Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.exception = function (pMessage) {

  // Set the body of the Modal
  $("#modal-exception").find(".modal-body > p").empty().html(pMessage);

  // Display the Modal
  $("#modal-exception").modal();
};


/*******************************************************************************
API - Library - URI
*******************************************************************************/
api.uri = {};

/**
 * Parse a URL and return the GET parameters as a object
 * @param {*} pURL 
 */
api.uri.parse = function (pURL) {
  var URI = new URI(pURL);
  return URI.parseQuery(uri.search());
};

/**
 * Check if a GET parameter is set in the URL
 * @param {*} pParam 
 * @param {*} pURL 
 */
api.uri.isParam = function (pParam, pURL) {
  // Default parameters
  pURL = pURL || window.location.href;

  // Parse the URL by using URI.js
  var uri = new URI(pURL);
  // Get the Query Parameters
  var paramsURL = URI.parseQuery(uri.search());
  if (pParam in paramsURL)
    return true;
  else
    return false;
};

/**
 * Return the GET parameter set in the URL
 * @param {*} pParam 
 * @param {*} pURL 
 */
api.uri.getParam = function (pParam, pURL) {
  // Default parameters
  pURL = pURL || window.location.href;

  // Parse the URL by using URI.js
  var uri = new URI(pURL);
  // Get the Query Parameters
  var paramsURL = URI.parseQuery(uri.search());
  if (pParam in paramsURL)
    return paramsURL[pParam];
  else
    return false;
};

/**
 * Check if the No Header request exists
 */
api.uri.getNoHeader = function () {
  return api.uri.isParam(C_API_URI_NOHEADER);
};

/**
 * Check if the No Navigation Bar request exists
 */
api.uri.getNoNavbar = function () {
  return api.uri.isParam(C_API_URI_NONAVBAR);
};

/**
 * Check if the No Footer request exists
 */
api.uri.getNoFooter = function () {
  return api.uri.isParam(C_API_URI_NOFOOTER);
};

/**
 * Get the Body request
 */
api.uri.getBody = function () {
  return api.uri.getParam(C_API_URI_BODY);
};

/*******************************************************************************
API - Library - Cookie
*******************************************************************************/
api.cookie = {};
api.cookie.session = {};
api.cookie.session.data = {
  length: null,
  expiry: null,
  logoutEndpoint: null,
  logoutMethod: null,
}
api.cookie.session.options = {
  path: "/",
  secure: "true",
  sameSite: "strict"
}

/**
 * Virtual method to confirm the extension of the Session Cookie
 * Override this method in the local application
 */
api.cookie.session.confirmExtension = function () { };

/**
 * Start the Session Cookie
 */
api.cookie.session.start = function (pLength, pLogoutEnpoint, pLogoutMethod) {
  // Get unix timestamp to deal with numbers rather than dates
  var timestamp = Math.round(new Date().getTime() / 1000);

  // Set the Session Cookie
  Cookies.set(
    C_API_COOKIE_SESSION,
    $.extend(true, {}, api.cookie.session.data,
      {
        length: pLength,
        expiry: timestamp + pLength,
        logoutEndpoint: pLogoutEnpoint,
        logoutMethod: pLogoutMethod
      }),
    api.cookie.session.options);

  // Run the routine every second
  window.setInterval(api.cookie.session.intervalRoutine, 1000);
};

/**
 * Extend the Session Cookie
 */
api.cookie.session.extend = function () {
  // Get the session cookie if any
  var data = Cookies.getJSON(C_API_COOKIE_SESSION);

  if (data) {
    // Get unix timestamp to deal with numbers rather than dates
    var timestamp = Math.round(new Date().getTime() / 1000);
    // Extend Session Cookie 
    Cookies.set(
      C_API_COOKIE_SESSION,
      $.extend(true, {}, data,
        {
          length: data.length,
          expiry: timestamp + data.length,
        }),
      api.cookie.session.options);
  }

};

/**
 * End the Session Cookie
 */
api.cookie.session.end = function (logoutEndpoint, logoutMethod) {
  logoutEndpoint = logoutEndpoint || null;
  logoutMethod = logoutMethod || null;
  var session = Cookies.getJSON(C_API_COOKIE_SESSION);
  // Run the Logout API
  api.ajax.jsonrpc.request(
    logoutEndpoint || session.logoutEndpoint,
    logoutMethod || session.logoutMethod,
    null,
    "api.cookie.session.endCallbak"
  );
  // Remove Session Cookie
  Cookies.remove(C_API_COOKIE_SESSION);
};

/**
 * End the Session Cookie callback
 */
api.cookie.session.endCallbak = function (data) {
  if (data == C_API_AJAX_SUCCESS) {
    // Force the reload of the application 
    window.location.href = window.location.pathname;
  }
  else {
    api.modal.exception("An unexpected error has occurred. Please try again.");
  }
};

/**
 * Routine to run at each interval
 */
api.cookie.session.intervalRoutine = function () {
  // Get the session cookie if any
  var data = Cookies.getJSON(C_API_COOKIE_SESSION);
  if (!data || $.active) {
    // If no session cookie or any running Ajax, then do nothing
    return;
  }

  // Get unix timestamp to deal with numbers rather than dates
  var timestamp = Math.round(new Date().getTime() / 1000);
  if (timestamp > data.expiry) {
    // The session has expired, force the logout
    api.cookie.session.end();
  } else if (timestamp > data.expiry - 60) {
    // The session is valid but about to expire (1 minute earlier), confirm the extension
    api.cookie.session.confirmExtension();
  } else {
    // The session is valid, do nothing
  }
};
