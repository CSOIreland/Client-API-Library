/*******************************************************************************
API - Library 
*******************************************************************************/
// Init & Set
var api = api || {};

//#region API - Library - Spinner

/*******************************************************************************
API - Library - Spinner
*******************************************************************************/
api.spinner = {};
api.spinner.count = 0;

/**
 * Show the Overlay and start the Spinner
 */
api.spinner.start = function () {
  if (!api.spinner.count++) {
    $(C_API_SELECTOR_SPINNER).show();
  }
}

/**
 * Hide the Overlay and stop the Spinner
 */
api.spinner.stop = function () {
  if (api.spinner.count) {
    // Do not go negative
    api.spinner.count--;
  }

  if (!api.spinner.count) {
    $(C_API_SELECTOR_SPINNER).fadeOut('slow');
  }
}

//#endregion

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
}

/**
 * Load a Relative URL into a Container
 * @param {*} pSelectorContainer 
 * @param {*} pRelativeURL 
 * @param {*} pParams 
 */
api.content.load = function (pSelectorContainer, pRelativeURL, pParams) {
  // Default parameters
  pParams = pParams || {};

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
      $(pSelectorContainer).empty().html(response).promise().done(function () {
        api.content.params = {};
      });
    }
  });
}

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

  $(pNavSelector).click(function () {
    /**
     * Load the URL with smooth transition
     * Set async to false to enforce script serialization
     * https://github.com/jquery/jquery/issues/4213
     */
    $.ajax({
      url: pRelativeURL,
      async: false,
      success: function (response) {
        $(C_API_SELECTOR_BODY).hide().empty().html(response).fadeIn();
      }
    });

    // "show" is a Bootstrap property
    $(C_API_SELECTOR_NAVIGATION).find("*").removeClass("show");
    // "active" is a Bootstrap property
    $(C_API_SELECTOR_NAVIGATION).find("*").removeClass("active");

    if (pNav_link_SelectorToHighlight)
      // "active" is a Bootstrap property
      $(pNav_link_SelectorToHighlight).addClass("active");

    if (pNav_menu_SelectorToHighlight) {
      // "active" is a Bootstrap property
      $(pNav_menu_SelectorToHighlight).addClass("active");
    }
  });
}

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
      $(C_API_SELECTOR_BODY).hide().empty().html(response).fadeIn().promise().done(function () {
        api.content.params = {};
      });
    }
  });

  // "show" is a Bootstrap property
  $(C_API_SELECTOR_NAVIGATION).find("*").removeClass("show");
  // "active" is a Bootstrap property
  $(C_API_SELECTOR_NAVIGATION).find("*").removeClass("active");

  if (pNav_link_SelectorToHighlight)
    // "active" is a Bootstrap property
    $(pNav_link_SelectorToHighlight).addClass("active");

  if (pNav_menu_SelectorToHighlight) {
    // "active" is a Bootstrap property
    $(pNav_menu_SelectorToHighlight).addClass("active");
  }
}

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
}

/**
 * Load the config/config.json in the application 
 * Javascript ajax must be used because the configuration must load synchronously before the JQuery $(document).ready
 * @param {*} callback
 */
api.ajax.config = function (callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'config/config.json', false);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    } else {
      alert("Internal Error: the configuration file \"config.json\" is missing or invalid.");
    }
  };
  xobj.send(null);
}

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
        api.modal.exception("Invalid JSON-RPC Identifier");
      } else if (callbackFunctionName_onSuccess)
        api.ajax.callback(callbackFunctionName_onSuccess, response, callbackParams_onSuccess);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (callbackFunctionName_onError) {
        api.ajax.callback(callbackFunctionName_onError, response, callbackParams_onError);
      }
      else if (errorThrown == "Unauthorized") {
        // Silent response when unauthorized authentication
      }
      else {
        // Pop the exception in the Bootstrap Modal
        api.modal.exception("Server or Network Error. Please try again or contact the Administrator if the problem persists.");
      }
    },
    complete: function () {
      // Simulate sync behaviour
      if (simulateSync)
        api.spinner.stop();

      // Stop the nav loader
      $(C_API_SELECTOR_NAV_LOADER).removeClass('text-yellow fa-spin').addClass('text-navbar');
      $("body").css("cursor", "default");
    }
  }

  // Merge pAJAX_Params into extendedAJAXParams
  $.extend(extendedAJAXParams, pAJAX_Params);

  try {
    // Start the nav loader
    $(C_API_SELECTOR_NAV_LOADER).removeClass('text-navbar').addClass('text-yellow fa-spin');
    $("body").css("cursor", "progress");

    // Simulate sync behaviour
    if (simulateSync)
      api.spinner.start();

    // Make the Ajax call
    return $.ajax(extendedAJAXParams);
  } catch (error) {
    // Pop the exception in the Bootstrap Modal
    api.modal.exception("Ajax Error. Please try again or contact the Administrator if the problem persists.");
    return false;
  }
}

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
  $(C_API_SELECTOR_MODAL_CONFIRM).find(C_API_SELECTOR_MODAL_BODY).empty().html(pMessage);

  $(C_API_SELECTOR_MODAL_BUTTON_CONFIRM).on("click", function () {
    // Run the Callback function
    pCallbackMethod(pCallbackParams);

    // Close the Modal
    $(C_API_SELECTOR_MODAL_CONFIRM).modal('hide');
  });

  $(C_API_SELECTOR_MODAL_CONFIRM).on('hide.bs.modal', function (e) {
    // Unbind to avoid the callback to loop
    $(C_API_SELECTOR_MODAL_BUTTON_CONFIRM).unbind("click");
  })

  // Display the Modal
  $(C_API_SELECTOR_MODAL_CONFIRM).modal();
};

/**
 * Pop a Success Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.success = function (pMessage) {

  // Set the body of the Modal
  $(C_API_SELECTOR_MODAL_SUCCESS).find(C_API_SELECTOR_MODAL_BODY).empty().html(pMessage);

  // Display the Modal
  $(C_API_SELECTOR_MODAL_SUCCESS).modal();
};

/**
 * Pop an Error Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.error = function (pMessage) {

  // Set the body of the Modal
  $(C_API_SELECTOR_MODAL_ERROR).find(C_API_SELECTOR_MODAL_BODY).empty().html(pMessage);

  // Display the Modal
  $(C_API_SELECTOR_MODAL_ERROR).modal();
};

/**
 * Pop an Information Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.information = function (pMessage) {

  // Set the body of the Modal
  $(C_API_SELECTOR_MODAL_INFORMATION).find(C_API_SELECTOR_MODAL_BODY).empty().html(pMessage);

  // Display the Modal
  $(C_API_SELECTOR_MODAL_INFORMATION).modal();
};

/**
 * Pop an Error Modal in Bootstrap
 * @param {*} pMessage 
 */
api.modal.exception = function (pMessage) {

  // Set the body of the Modal
  $(C_API_SELECTOR_MODAL_EXCEPTION).find(C_API_SELECTOR_MODAL_BODY).empty().html(pMessage);

  // Display the Modal
  $(C_API_SELECTOR_MODAL_EXCEPTION).modal();
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
}

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
}

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
}

/**
 * Check if the No Header request exists
 */
api.uri.getNoHeader = function () {
  return api.uri.isParam(C_API_URI_NOHEADER);
}

/**
 * Check if the No Navigation Bar request exists
 */
api.uri.getNoNavbar = function () {
  return api.uri.isParam(C_API_URI_NONAVBAR);
}

/**
 * Check if the No Footer request exists
 */
api.uri.getNoFooter = function () {
  return api.uri.isParam(C_API_URI_NOFOOTER);
}

/**
 * Get the Body request
 */
api.uri.getBody = function () {
  return api.uri.getParam(C_API_URI_BODY);
}