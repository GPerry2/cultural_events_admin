/* eslint-disable no-unused-vars */
/**
 * Global Variables
 * @param app {object} coreJS cot_app object
 * @param httpHost {string} current environment [local,dev,qa,prod]
 * @param oLogin {object}
 * @param config {object} JSON  Object shorthand for app.data.config
 * @param myDropzone {object} DropZone.js custom COT implementation
 */
const app = new cot_app('', {
  hasFooter: false,
  hasContentBottom: true,
  hasContentRight: true,
  hasContentLeft: true,
  hasContentTop: true,
  hasLeftNav: false,
  searchcontext: 'INTRA'
});
let httpHost, oLogin, config, myDataTable;
let dropzones = [];
/**
 *
 * @method ready
 * @implements jquery ready
 * @param function - calls init method once config file is loaded into cot_app
 * @description - instantiate a core_js cot_app, load config file with settings (app.data)
 */
$(document).ready(function () {
  app.loadContent({
    success: function () {
      config = app.data.config;
      httpHost = detectHost();
      app.setBreadcrumb(config.breadcrumbtrail);
      app.includeLogin = app.includeDatePicker = app.includeRangePicker = app.includeFormValidation = app.includePlaceholders = app.includeMultiSelect = true;
      app.searchContext = "INTRA";
      app.render(init);
    },
    skiproot: false,
    dataType: "json",
    url: configURL
  });
});

/**
 * @method parseHash
 * @param {object} newHash
 * @return {object} - Global crossroads object
 */
function parseHash(newHash) {
  if(newHash!==""){$.cookie(encodeURIComponent(config.default_repo) + '.lastHash', newHash,{expires:7});}
  crossroads.parse(newHash);
}

/**
 * @method init
 * set up crossroads / hasher to add routes for view and forms
 * instantiate a core_js cot_login object with initFrontPage as
 * configure button onclick events
 * on cot_login login success, initFrontPage is called
 */
function init() {
  crossroads.ignoreState = true;
  crossroads.addRoute(':?query:', homePage);
  crossroads.addRoute('{formName}:?query:', frontPage);
  crossroads.addRoute('{formName}/new:?query:', newPage);
  crossroads.addRoute('{formName}/{id}:?query:', viewEditPage);
  oLogin = new cot_login({
    ccRoot: config.httpHost.app["prod"],
    welcomeSelector: "#app-content-right",
    onLogin: initFrontPage,
    appName: config.default_repo
  });
}

/**
 * @method initFrontPage
 * @param {object} data - cot_login object with LDAP data specific to user
 * @return
 * If cot_login.isLoggedIn() then initialized the global hasher object to load the correct interface based on the url query string hash
 */
function initFrontPage(data) {
  $(app.getContentContainerSelector("right")).hide();
  $("#app-header").hide();
  // Save group names based on user's group permissions
  if (data && data.groups) {
    config.username = oLogin.username;
    /*
    hasher.initialized.add(parseHash); // Parse initial hash
    hasher.changed.add(parseHash); // Parse hash changes
    hasher.init(); // Start listening for history change
*/

    tpl('#app-content-bottom', 'html/main.html', function () {


      hasher.initialized.add(parseHash); // Parse initial hash
      hasher.changed.add(parseHash); // Parse hash changes
      hasher.init(); // Start listening for history change

      typeof registerEvents==="function"?registerEvents():"";
      // scroll to top fade-in fade-out
      $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
          $("#back-to-top").fadeIn();
        } else {
          $("#back-to-top").fadeOut();
        }
      });

      // Scroll to top
      $("#back-to-top").on('click',function () {
        $("#back-to-top").tooltip('hide');
        $("html, body").animate({
          scrollTop: 0
        }, 'fast');
        return false;
      });

      $("#back-to-top").tooltip('show');
      /**
       * Optional: implement a function appInitialize with no parameters to perform any tasks post render
       */
      typeof appInitialize==="function"?appInitialize():"";

    });

  }
}

/**
 * @method detectHost
 * @param {object} - global config object
 * @return {string}
 * Utility method to determine the COT environment [local, dev, qa or prod]
 */
function detectHost() {
  switch (window.location.origin) {
    case config.httpHost.root.local:
      return 'local';
    case config.httpHost.root.dev:
      return 'dev';
    case config.httpHost.root.qa:
      return 'qa';
    case config.httpHost.root.prod:
      return 'prod';
    default:
      return 'local';
  }
}

/**
 * @method auth()
 * @return {boolean}
 * Utility method to call and check if user is still logged in
 */
function auth() {
  //console.log('auth')
  if (!oLogin.isLoggedIn()) {
    oLogin.showLogin();
    return false;
  }
  else {
    oLogin.session.extend(config.api.timeout);
    $(app.getContentContainerSelector("right")).hide();
    $("#app-header").hide();
    return true;
  }
}

/**
 * @method tpl(id, mst, callback)
 * @param id {string} - target id of object to render into
 * @param url {string} - url of the partial html
 * @param callback {function} - what to do next
 * Utility method to load partial html file in and populate with data vai moustache.js library
 */
function tpl(id, url, callback) {
  $.get(url, function (template) {
    let rendered = Mustache.render(template, config);
    $(id).empty().html(rendered);
    $("#form_pane").hide();
    callback();
  }).fail(function () {
    $(id).empty();
    console.log('Failed to load template: ' + url);
  });
}

/**
 * @method homePage()
 * @return {object} - global hasher object
 * Method to direct logged in user to the home page as defined in the config file OR the last access view based on a cookie.
 */
function homePage() {
  let lastView = $.cookie(encodeURIComponent(config.default_repo) + '.lastHash');
  hasher.setHash((lastView ? lastView : config.default_view + '?ts=' + new Date().getTime() + '&status=' ) );
}

/**
 * @method frontPage
 * @param formName {string}
 * @param query {object} - JSON Object of query parameters
 * Main interface with default view to display
 * calls - openView method
 */
function frontPage(formName, query) {
  if (auth()) {
    /* List submissions */
    let status = (query && query.status) ? query.status : "";
    let repo = (query && query.repo) ? query.repo : config.default_repo;
    let filter = [];
    try {
      $.each((query && query.filter) ? JSON.parse(query.filter).items : "", function (i, item) {
        filter[item.field] = item.value;
      });
    } catch (e) {
      console.warn("issue parsing filter");
    }

    let target = "view_pane"
    $('ul.dropdown-menu > li').removeClass('active');
    $('.forForm').hide();
    $('.forView').show();

    oLogin.session.isLoggedIn(function (result) {
      switch (result) {
        case CotSession.LOGIN_CHECK_RESULT_TRUE:
          //we are still logged in! continue...
          openView(status, filter, repo, target, formName);
          break;
        case CotSession.LOGIN_CHECK_RESULT_FALSE:
          //we are logged out, do some stuff...
          //bootbox.alert("Your session has expired, please logout and log back in to proceed");
          oLogin.showLogin();
          break;
        default:
          bootbox.alert('we may be logged out, or the server or network may just be down');
          oLogin.showLogin();
          break;
      }
    });

  }
}

/**
 * @method openView
 * @param status {string}  - entity collection status (approved/submitted/draft) optionally used to filter a entity set
 * @param filter {object} - JSON Object of query parameters
 * @param repo {string} - the app name for config api
 * @param target {string} - dom id of where to render view/DataTable
 * @param formName {string} -  the entity set/collection name
 * @return DataTable {object}
 * method for creating and loading DataTable into container
 */
function openView(status, filter, repo, target, formName) {
 //console.log(status, filter, repo, target, formName)
  //Update View Title
  let columnDefs, view, viewname;
  viewname = (status == "" ? "All " : status + " ") + config.listName[formName];
  $("#viewtitle").html(viewname);
  //set the last user view to return to after search OR viewing a document
  $.cookie(encodeURIComponent(config.default_repo) + '.lastView', formName, {expires:7});
  $.cookie(encodeURIComponent(config.default_repo) + '.lastViewName', viewname, {expires:7});
  $.cookie(encodeURIComponent(config.default_repo) + '.lastViewHash', hasher.getHash(), {expires:7});
  [columnDefs, view]= getColumnDefinitions(formName, filter);
  /*
  switch (formName) {
    case'hot_spot':
      columnDefs = [
        {"data": "hs_eventName", "title": "Event Name", "filter": false, "sortOrder": "asc"},
        {
          "data": "hs_eventStatus",
          "title": 'Event Status',
          "filter": true,
          "sortOrder": "asc",
          "restrict": filter["hs_eventStatus"],
          "filterChoices": app.data.eventStatusFilter
        },
        {
          "data": "hs_eventProject",
          "title": "Project",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventProjectFilter
        },
        {"data": "hs_ward_1", "title": "Ward", "filter": true, "sortOrder": "asc", "filterChoices": app.data.wards},
        {
          "data": "hs_eventFeatured",
          "title": "Featured",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventFeaturedFilter
        },
        {
          "data": "hs_eventType",
          "title": "Type",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventTypeFilter
        },
        {
          "data": "hs_eventAccessibility",
          "title": "Accessible",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventFeaturesFilter
        },
        {
          "data": "hs_eventFamily",
          "title": "Family?",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventYesNoFilter
        },
        {
          "data": "hs_eventFree",
          "title": "Free?",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": app.data.eventYesNoFilter
        }
      ];
      view = "hot_spot";
      break;
    default:
      break;
  }
  */
  //sequentially set the column targets property: 1, 2, 3, 4...
  $.each(columnDefs, function (i, col) {
    col.targets = i;
  });
  // build cc_retrieve_view constructor
  let args = {
    "url": config.httpHost.app[httpHost] + config.api.get + repo + '/' + view ,
    "target": $("#" + target),
    "formName": formName,
    "columnDefs": columnDefs,
    "addScroll": true,
    "addFilter": true,
    "defaultSortOrder": "desc",
    "addFooter": true,
    "dateFormat": config.dateTimeFormat
  };
  //initialize new cc_retrieve_view (pass in constructor)
  myDataTable = new cc_retrieve_view(args);
  //render cc_retrieve_view
  $.fn.dataTableExt.afnFiltering.pop();
  myDataTable.render();
  myDataTable.dt.buttons().container().hide();

  $("#admin_search").on("keyup search input paste cut", function () {
    $("#btn-adminSearch").find('i').removeClass('glyphicon glyphicon-refresh').addClass('glyphicon glyphicon-search');
    myDataTable.dt.search(this.value).draw();
  });
/*
  $('#tabExportCSV').click(function () {
    $(".dt-button.buttons-csv.buttons-html5").click();
  });
  $('#tabExportEXCEL').click(function () {
    $(".dt-button.buttons-excel.buttons-html5").click();
  });
  $('#tabExportPDF').click(function () {
    $(".dt-button.buttons-pdf.buttons-html5").click();
  });
  $('#tabExportCOPY').click(function () {
    $(".dt-button.buttons-copy.buttons-html5").click();
  });
*/
  toggleView("view_pane");
  //typeof registerEvents==="function"?registerEvents():"";
  return myDataTable;
}

/**
 * @method newPage
 * @param formName {string} name of oData entity set
 * @param query {object} - JSON Object of query parameters
 * starting point for creating a new document/submission/entity
 * crossroads.addRoute('{formName}/new:?query:', newPage);
 */
function newPage(formName) {
  if (auth()) {
    $('.forForm').show();
    $('.forView').hide();
    $("#viewtitle").html('NEW - ' + config.formName[formName]);
    //loadForm("#view_pane", null, null, config.default_repo, formName);
    loadForm("#form_pane", null, null, config.default_repo, formName);
  }
}

/**
 * @method viewEditPage(formName, id, query)
 * @param formName {string} name of oData entity set
 * @param id  {string} guid of the entity to edit
 * @param query {object} - JSON Object of query parameters
 starting point for editing an existing document/submission/entity
 */
function viewEditPage(formName, id, query) {
  if (query && query.alert && query.msg) {
    config.messages.current = eval('config.messages.' + query.msg);
  } else {
    config.messages.current = '';
  }

  if (query && query.alert && query.msg) {
    if (query.alert === 'success') {
      bootbox.alert(config.messages.current);
    } else if (query.alert === 'danger') {
      bootbox.alert(config.messages.current);
    }
  }

  let repo = config.default_repo;
  if (auth()) {

    $.ajax(
      {
        "url": config.httpHost.app[httpHost] + config.api.get + repo + '/' + formName + "('" + id + "')",
        "headers": {
          "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid')
        }
      }
    )
      .done(function (data) {
        /*@ToDO: find out/fix hack around issue with etag*/
        data["@odata.etag"] = "";
        $('.forForm').show();
        $('.forView').hide();
        $("#viewtitle").html(data[config.formHeaderFieldMap[formName] ]);
        loadForm("#form_pane", data, id, repo, formName);
      })
      .fail(function (textStatus, error) {
        $("#page-content > .alert-danger").append(textStatus + ' ' + error + ' ' + config.messages.load.fail).removeClass('hidden').fadeOut(config.messages.fadeOutTime, function () {
          $(this).addClass('hidden');
        });
      });
  }
}

/**
 * @method loadForm
 * @param destinationSelector {string} - dom id of where to render view/DataTable
 * @param data {object} data from the GET to the C3API to retrieve entity JSON
 * @param fid {string} guid of the entity to edit
 * @param repo {string} - the app name for config api
 * @param form_id {string} name of oData entity set
 * @description - called from init method view crossroads and hasher
 *
 * crossroads.addRoute('{formName}/{id}:?query:', viewEditPage);
 */
function loadForm(destinationSelector, data, fid, repo, form_id) {
  //console.log('loadForm', destinationSelector, data, fid, repo, form_id);
  $(destinationSelector).empty();

  let f = new CotForm({
    "id": form_id,
    title: '',
    rootPath: '',
    useBinding: false,
    sections: getSubmissionSections(form_id),
    success: function () {
      processForm("save", repo, form_id, fid);

    }
  });
  app.forms[form_id] = f;
  f.render({"target": destinationSelector});

  $('.dropzone').each(function(index){
    let upload_defaults = config.upload_defaults;
    let maxFiles = parseInt($(this).attr("maxFiles"))?parseInt($(this).attr("maxFiles")):upload_defaults.maxFiles;
    let maxFilesize = parseInt($(this).attr("maxFilesize")) ? parseInt($(this).attr("maxFilesize")):upload_defaults.maxFilesize;
    let acceptedFiles = $(this).attr("acceptedFiles") ? $(this).attr("acceptedFiles"): upload_defaults.acceptedFiles;
    let dictDefaultMessage =  $(this).attr("dictDefaultMessage") ?  $(this).attr("dictDefaultMessage") : upload_defaults.dictDefaultMessage ;
    let dictFileTooBig =   $(this).attr("dictFileTooBig") ? $(this).attr("dictFileTooBig"): upload_defaults.dictFileTooBig ;
    let addRemoveLinks= $(this).attr("addRemoveLinks")=='' ? upload_defaults.addRemoveLinks:($(this).attr("addRemoveLinks")=='true');
    let dictMaxFilesExceeded = $(this).attr("dictMaxFilesExceeded") ? $(this).attr("dictMaxFilesExceeded") : upload_defaults.dictMaxFilesExceeded;


    let myDropzone = new Dropzone("div#"+$(this).attr("id"), {
      "dz_id":$(this).attr("id")+ "_dz","fid":fid, "form_id":form_id ,
      "url": config.httpHost.app[httpHost] +  config.api.upload +config.upload_repo + '/' + config.upload_repo,
      "acceptedFiles":acceptedFiles,
      "maxFiles": maxFiles,
      "dictDefaultMessage":dictDefaultMessage,
      "maxFilesize":maxFilesize,
      "dictFileTooBig":dictFileTooBig,
      "addRemoveLinks":addRemoveLinks,
      "dictMaxFilesExceeded": dictMaxFilesExceeded
    });
    dropzones[$(this).attr("id")] = myDropzone;
  });


  let modifiedUsername = decodeURIComponent(getCookie(repo + '.cot_uname'));
  let modifiedName = decodeURIComponent(getCookie(repo + '.firstName')) + ' ' + decodeURIComponent(getCookie(repo + '.lastName'));
  let modifiedEmail = decodeURIComponent(getCookie(repo + '.email'));

  // New report
  if (!data) {
    // Set created by and modified by to current user
    $("#createdBy, #modifiedBy").val(modifiedUsername);
    $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
    /*@TODO: Add in logic to verify user has ability to Delete*/
    $('.btn-delete').hide();
  }
  // View/Edit existing report
  else {
    f.setData(data);
    $('.dropzone').each(function(){
      console.log('show uploads')
    showUploads(dropzones[$(this).attr("id")] ,$(this).attr("id"), data, repo, true, true);
    })

    $("#modifiedBy").val(modifiedUsername);
    if (!$("#modifiedEmail").val()) {
      $("#modifiedBy").val(modifiedUsername);
      $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
    }
    else if ($("#modifiedEmail").val().indexOf(modifiedEmail) == -1) {
      if ($("#modifiedEmail").val()) {
        let emailObj = JSON.parse($("#modifiedEmail").val());
        emailObj[modifiedName] = modifiedEmail;
        $("#modifiedEmail").val(JSON.stringify(emailObj));
      } else {
        $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
      }
    }
  }
 //f.CotForm.callFunction(toggleView("form_pane");)
  toggleView("form_pane");
 //typeof registerEvents==="function"?registerEvents():"";
}

/**
 * @method saveReport(action, payload, msg, repo,form_id)
 * @param action {string} - placeholder for future enhancement to allow for specific functionality based on action taken
 * @param payload {object} - data to post to api
 * @param msg {object} - message to display to user if success or fail
 * @param repo {string} - the app name for config api
 * @param form_id {string} -  the entity set/collection name
 * called from processForm method
 */
function saveReport(action, payload, msg, repo, form_id) {
  $(".btn").prop('disabled', true);
  $.ajax({
    "url": config.httpHost.app[httpHost] + config.api.post + repo + '/' + form_id + '?sid=' + getCookie(repo + '.sid'),
    "type": "POST",
    "data": payload,
    "headers": {
      "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
      "Content-Type": "application/json; charset=utf-8;",
      "Cache-Control": "no-cache"
    },
    "dataType": "json"
  }).success(function (data, textStatus, jqXHR) {
    if (jqXHR.status == 201 && data.id) {
      //myDataTable.dt.ajax.reload();
      // Route to /{id} draft page if new report is successfully saved
      hasher.setHash(form_id + '/' + data.id + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
    } else {
      hasher.setHash(form_id + '/new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
    }
  }).error(function (textStatus, error) {
    alert("POST Request Failed: " + textStatus + ", " + error);
    hasher.setHash(form_id + '/new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
  }).always(function () {
    $(".btn").removeAttr('disabled').removeClass('disabled');
  });
}

/**
 * @method updateReport(fid, action, payload, msg, repo,form_id)
 * @param fid {string} - guid of the entity
 * @param action {string} - placeholder for future enhancement to allow for specific functionality based on action taken
 * @param payload {object} - data to post to api
 * @param msg {object} - message to display to user if success or fail
 * @param repo {string} - the app name for config api
 * @param form_id {string} -  the entity set/collection name
 * called from processForm method
 */
function updateReport(fid, action, payload, msg, repo, form_id) {
  $(".btn").prop('disabled', true);
  $.ajax({
    "url": config.httpHost.app[httpHost] + config.api.get + repo + '/' + form_id + "('" + fid + "')"+ '?sid=' + getCookie(repo + '.sid'),
    "type": "PATCH",
    "data": payload,
    "headers": {
      "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
      "Content-Type": "application/json; charset=utf-8;",
      "Cache-Control": "no-cache"
    },
    "dataType": "json"
  }).success(function (data, jqXHR) {
    //myDataTable.dt.ajax.reload();
    switch (action) {
      case 'save':
        hasher.setHash(form_id + '/' + fid + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
        break;
      default:
        hasher.setHash(form_id + '/' + fid + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
        break;
    }
  }).error(function (textStatus, error) {
    alert("PATCH Request Failed: " + textStatus + ", " + error);
    hasher.setHash(form_id + '/' + fid + '?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
  }).always(function () {
    $(".btn").removeAttr('disabled').removeClass('disabled');
  });

}

/**
 * @method processForm
 * @param action {string} - placeholder for future enhancement to allow for specific functionality based on action taken
 * @param repo {string} - the app name for config api
 * @param form_id {string} -  the entity set/collection name
 * @param fid {string} - guid of the entity
 */
function processForm(action, repo, form_id, fid) {
  let msg;
  //get the form data
  let f_data = app.forms[form_id].getData();
  //process any drop zones and add the uploaded file data to the payload.
  $('.dropzone').each(function(index){
    f_data[$(this).attr("id")]= processUploads(dropzones[$(this).attr("id")], repo, true);
  })
  console.log(f_data);
  msg = {
    'done': 'save.done',
    'fail': 'save.fail'
  };
  if (fid) {
    updateReport(fid, action, JSON.stringify(f_data), msg, repo, form_id);
  }
  // Create new
  else {
    saveReport(action, JSON.stringify(f_data), msg, repo, form_id);
  }
}
function toggleView(target){
  let appName,lastView,lastViewHash, lastViewName,lastHash;
  appName = config.default_repo;
 //lastView = $.cookie(encodeURIComponent(appName) + '.lastView');
  lastViewHash = $.cookie(encodeURIComponent(appName) + '.lastViewHash');
  lastViewName = $.cookie(encodeURIComponent(appName) + '.lastViewName');
 // lastHash = $.cookie(encodeURIComponent(appName) + '.lastHash');

  if(target==="view_pane"){
    $("#view_pane, .forView").show();
    $("#form_pane, .forForm").hide();
    $("#form_pane").html("");
    $.cookie(appName+ '.lastHash', lastViewHash,{expires:7});
    setHashSilently(lastViewHash);
    if ($("#view_pane").is(":empty")){
      hasher.setHash( appName + '?ts=' + new Date().getTime() + '&status='  );
    }
    else{

      $("#viewtitle").html(lastViewName===""?config.title:lastViewName);
    }
  }
  else{
    $("#view_pane").hide();
    $(".forView").hide();
    $("#form_pane").show();
    $(".forForm").show();
  }
}
function setHashSilently(hash){
  hasher.changed.active = false; //disable changed signal
  hasher.setHash(hash); //set hash without dispatching changed signal
  hasher.changed.active = true; //re-enable signal
}
/**
 * @class cc_retrieve_view
 * @classdesc COT C3API oData DataTable implementation
 * @example for an example, see the openView method
 */
class cc_retrieve_view {
  /**
   * @method constructor
   * @param args {object} parameters to apply to the new cc_retrieve_view
   */
  constructor(args) {
    this.url = args.url;
    this.target = args.target;
    this.formName = args.formName;
    this.addFooter = args.addFooter;
    this.addFilter = args.addFilter;
    this.addScroll = args.addScroll;
    this.columnDefs = args.columnDefs;
    this.dateFormat = args.dateFormat;
    this.sortOrder = args.sortOrder;
    this.defaultSortOrder = args.defaultSortOrder;
    this.dom_table;
    this.dt;
    this.dateFilterLoaded;
  }

  /**
   * @method uniqueId
   * @param length
   * @returns {string}
   * @description generates a unique uid of numeric characters with a length passed in in the length parameter
   * this is used to create unique id for each DataTable on a page.
   */
  uniqueId(length) {
    let id = Math.floor(Math.random() * 26) + Date.now();
    return id.toString().substring(length);
  }

  /**
   * @method getColumns
   * @returns {string}
   * @description
   */
  getColumns() {
    let listHTML = "";
    $.each(this.columnDefs, function () {
      listHTML += '<th></th>';
    });
    return listHTML;
  }

  /**
   * @method getColumnSortOrder
   * @returns {Array}
   */
  getColumnSortOrder() {
    let arrSortOrder = [];
    $.each(this.columnDefs, function (i, item) {
      if (item.data != null) {
        arrSortOrder.push(new Array(i, item.sortOrder ? item.sortOrder : this.defaultSortOrder))
      }
    });
    return arrSortOrder
  }

  /**
   * @method getTable
   * @returns {*}
   */
  getTable() {
    return this.dom_table;
  }

  /**
   * @method render
   * @returns {*}
   */
  render() {
    let _this = this;
    let unid = this.uniqueId(4);
    let cols = this.getColumns();
    let listHTML = '<table class="" style="width:100%;" id="' + unid + '" >';
    if ($.fn.dataTableExt.afnFiltering.length === 0) {
      $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData) {
          let test = true;
          //loop through all columns to see what type of filter to apply
          $.each(_this.columnDefs, function (i, col) {
            //currently only date range is implemented.
            if (col.filter && col.type == "date") {
              if (moment.isMoment(col.minDateFilter) && moment.isMoment(col.maxDateFilter) && test == true) {
                test = moment(col.link ? $(aData[i]).text() : aData[i]).isBetween(col.minDateFilter, col.maxDateFilter);
              }
            }
          });
          return test;
        }
      );
    }
    listHTML += '<thead><tr>' + cols + '</tr></thead>';
    listHTML += this.addFooter ? '<tfoot><tr>' + cols + '</tr></tfoot>' : '';
    listHTML += '</table>';
    let dateFormat = this.dateFormat;
    this.target.empty().html(listHTML);
    this.dt = $("#" + unid).DataTable({
      'formName': _this.formName,
      'scrollX': _this.addScroll, // USED FOR HORIZONTAL SCROLL BAR
      'bAutoWidth': _this.addScroll,
      'order': this.getColumnSortOrder(),
      'bProcessing': true,
      'bServerSide': true,
      'dom': "<'row'<'col-sm-8 pull-left'i><'col-sm-4 pull-right'l>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'hidden'B><'col-sm-12 pull-right'p>>",
      'buttons': ['pdfHtml5', 'csvHtml5', 'copyHtml5', 'excelHtml5'],
      'deferRender': false,
      //'stateSave': true,
     // 'stateDuration': 0,
      'sAjaxSource': this.url,
      'fnServerData': this.fnServerOData,
      'iODataVersion': 4,
      'bUseODataViaJSONP': false,
      'createdRow': function (row, data) {
        let doc_id = data.id ? data.id : data['@odata.id'].substring((data['@odata.id'].indexOf("('") + 2), (data['@odata.id'].indexOf("')")));
        $(row).attr('data-id', doc_id);
        $(row).attr('data-link', data['@odata.id']);
        $(row).attr('data-formName', _this.formName);
        $(row).attr('data-OrderNumber', data['OrderNumber']);
      },
      "columnDefs": this.columnDefs,
      "select":true,
      'initComplete': function () {
        //Add filtering Table if requested
        this.api().columns().every(function () {
          let column = this;
          if (_this.addFilter) {
            //Add filtering to column if requested
            if (_this.columnDefs[this.index()].filter) {
              if (_this.columnDefs[this.index()].type == 'date') {
                /*
                 Add date rang picker here for advanced filtering
                 */
                let dr = $('<input aria-label="Filter for column:' + _this.columnDefs[this.index()].title + '" class="form-control input-xs" id="dr_filter_' + column.data + '" value=""/>')
                  .appendTo($(column.footer()).empty().html("<span class='sr-only'>" + _this.columnDefs[this.index()].title + "</span>"))
                  .on('change', function () {
                    let val = $(this).val();
                    column
                      .search(val)
                      .draw();
                  });
                dr.daterangepicker({
                  autoUpdateInput: false,
                  locale: {
                    "format": "YYYY-MM-DD",
                    "separator": " to ",
                    "applyLabel": "Apply",
                    "cancelLabel": "Clear"
                  }
                });
                dr.on('apply.daterangepicker', function (ev, picker) {
                  _this.columnDefs[column.index()].minDateFilter = picker.startDate;
                  _this.columnDefs[column.index()].maxDateFilter = picker.endDate;

                  $(this).val(picker.startDate.format(config.dateFormat) + ' - ' + picker.endDate.format(config.dateFormat));
                  column.draw();
                });
                dr.on('cancel.daterangepicker', function (ev, picker) {
                  $(this).val('');
                  _this.columnDefs[column.index()].minDateFilter = '';
                  _this.columnDefs[column.index()].maxDateFilter = '';
                  column
                    .search('')
                    .draw();
                });
              }
              else {
                //add in dropdown and populate values
                let select = $('<select aria-label="Filter for column:' + _this.columnDefs[this.index()].title + '"><option value=""></option></select>')
                  .appendTo($(column.footer()).empty().html("<span class='sr-only'>" + _this.columnDefs[this.index()].title + "</span>"))
                  .on('change', function () {
                    let val = $(this).val();
                    column
                      .search(val)
                      .draw();
                  });
                let options = new Array();

                if (_this.columnDefs[this.index()].filterChoices) {
                  $.each(_this.columnDefs[this.index()].filterChoices, function (i, val) {
                    options.push('<option value="' + val + '">' + val + '</option>')
                  });
                }
                else {
                  column.data().each(function (d) {
                    if ($.isArray(d)) {
                      jQuery.each(d, function (index, item) {
                        options.push('<option value="' + item + '">' + item + '</option>');
                      })
                    } else {
                      options.push('<option value="' + d + '">' + d + '</option>')
                    }
                  });
                }


                $.each(jQuery.uniqueSort(options), function (index, item) {
                  select.append(item);
                });
              }
            }
            else {
              $(column.footer()).empty().html("<span class='sr-only'>" + _this.columnDefs[this.index()].title + "</span>")
            }
            column.draw();
          }
        });

       // $("#maincontent .dataTable tbody tr").on('click', function(){
       //    hasher.setHash($(this).attr('data-formName') + '/' + $(this).attr('data-id') + '?ts=' + new Date().getTime() );
       // });

        let tbody = $('#'+unid+ ' tbody');
        let dt = $('#'+unid).DataTable();
        tbody.on('dblclick', 'tr', function () {
          //let data = dt.row( this ).data();
          $(this).addClass('selected');
          hasher.setHash($(this).attr('data-formName') + '/' + $(this).attr('data-id') + '?ts=' + new Date().getTime() );
        } );

               tbody.on('click', 'tr', function () {

                 if ( $(this).hasClass('selected') ) {
                   $(this).removeClass('selected');
                 }
                 else {
                   dt.$('tr.selected').removeClass('selected');
                   $(this).addClass('selected');
                 }
               } );

        $('.input-mini.form-control').each(function (i) {
          let cb = $(this);
          cb.attr("id", cb.attr("name") + "_" + i)
          cb.before($("<label />")
            .attr("for", cb.attr("id"))
            .text("Date Range Picker Input")
            .addClass("sr-only"))
        });
      },
      "bStateSave": true,
      "fnStateSave": function (oSettings, oData) {
        console.log("fnStateSave");
        localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
      },
      "fnStateLoad": function (oSettings) {
        console.log("fnStateLoad");
        var data = localStorage.getItem('DataTables_' + window.location.pathname);
        return JSON.parse(data);
      }
    });
    this.dom_table = $("#" + unid);
    return this.dt;
  }

  /**
   * @method fnServerOData
   * @param sUrl
   * @param aoData
   * @param fnCallback
   * @param oSettings
   */
  fnServerOData(sUrl, aoData, fnCallback, oSettings) {
    let oParams = {};
    $.each(aoData, function (i, value) {
      oParams[value.name] = value.value;
    });
    let data = {"$format": "json", "$count": true};
    let bJSONP = oSettings.oInit.bUseODataViaJSONP;
    if (bJSONP) {
      data.$callback = "odatatable_" + (oSettings.oFeatures.bServerSide ? oParams.sEcho : ("load_" + Math.floor((Math.random() * 1000) + 1)));
    }
    $.each(oSettings.aoColumns, function (i, value) {
      let sFieldName = (value.sName !== null && value.sName !== "") ? value.sName : ((typeof value.mData === 'string') ? value.mData : null);
      //if (sFieldName === null || !isNaN(Number(sFieldName))) {sFieldName = value.sTitle;}
      if (sFieldName === null || !isNaN(Number(sFieldName))) {
        return;
      }
      if (data.$select == null) {
        data.$select = sFieldName;
      } else {
        data.$select += "," + sFieldName;
      }
    });

    if (oSettings.oFeatures.bServerSide) {
      data.$skip = oSettings._iDisplayStart;
      if (oSettings._iDisplayLength > -1) {
        data.$top = oSettings._iDisplayLength;
      }
      let asFilters = [];
      let asColumnFilters = []; //used for jquery.dataTables.columnFilter.js
      $.each(oSettings.aoColumns,
        function (i, value) {
          let sFieldName = value.sName || value.mData;
          //added as a way to fake a Domino style RestrictToCategory. In the column definition, add a restrict property with the value you want to filter
          let restrict = value.restrict;
          let columnFilter = oParams["sSearch_" + i] + (restrict ? restrict : "");
          //fortunately columnFilter's _number matches the index of aoColumns
          if ((oParams.sSearch !== null && oParams.sSearch !== "" || columnFilter !== null && columnFilter !== "") && value.bSearchable) {
            if (oParams.sSearch !== null && oParams.sSearch !== "") {
              asFilters.push("contains((" + sFieldName + "),'" + oParams.sSearch + "')");
            }
            if (columnFilter !== null && columnFilter !== "") {
              asColumnFilters.push("contains((" + sFieldName + "),'" + columnFilter + "')");
            }
          }
        });

      if (asFilters.length > 0) {
        data.$filter = asFilters.join(" or ");
      }
      if (asColumnFilters.length > 0) {
        if (data.$filter !== undefined) {
          data.$filter = "(" + data.$filter + ") and (" + asColumnFilters.join(" and ") + ")";
        } else {
          data.$filter = asColumnFilters.join(" and ");
        }
      }

      let asOrderBy = [];
      for (let i = 0; i < oParams.iSortingCols; i++) {
        asOrderBy.push(oParams["mDataProp_" + oParams["iSortCol_" + i]] + " " + (oParams["sSortDir_" + i] || ""));
      }
      if (asOrderBy.length > 0) {
        data.$orderby = asOrderBy.join();
      }
    }
    sUrl += '?' +
      Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(data[key]);
      }).join('&');
    $.ajax(jQuery.extend({}, oSettings.oInit.ajax, {
      "url": sUrl,
      "jsonp": bJSONP,
      "dataType": bJSONP ? "jsonp" : "json",
      "jsonpCallback": data["$callback"],
      "cache": false,
      "headers": {
        "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid')
      },
      "success": function (data) {
        let oDataSource = {};
        oDataSource.aaData = data.value;
        let iCount = data["@odata.count"];
        if (iCount == null) {
          if (oDataSource.aaData.length === oSettings._iDisplayLength) {
            oDataSource.iTotalRecords = oSettings._iDisplayStart + oSettings._iDisplayLength + 1;
          } else {
            oDataSource.iTotalRecords = oSettings._iDisplayStart + oDataSource.aaData.length;
          }
        } else {
          oDataSource.iTotalRecords = iCount;
        }
        oDataSource.iTotalDisplayRecords = oDataSource.iTotalRecords;
        fnCallback(oDataSource);
      }
    }));
  } // end fnServerData
}

/**
 * @method updateAttachmentStatus
 * @param DZ {object} -the DropZone object
 * @param bin_id {string} GUID of the uploaded file returned froim the upload api
 * @param repo {string} - the event repo name that will be used to use in the delete url.
 * @param status {string} - Status to set the uploaded file to (delete or keep)
 */
function updateAttachmentStatus(DZ,bin_id, repo, status){
  let deleteURL = config.httpHost.app[httpHost] + config.api.upload_post + 'binUtils/'+ config.default_repo + '/' + bin_id + '/'+status+'?sid=' + getCookie(config.default_repo+'.sid');
  $.get(deleteURL, function(){
    if(status=='delete'){
      $('#'+ bin_id).remove();
      DZ.existingUploads = $.grep(DZ.existingUploads, function(e){return e.bin_id!=bin_id})

      let form_id = DZ.options.form_id;
      processForm('updateAttachments', form_id, repo)
    }
  }).fail(function(){
    console.log('failed');
  });
}

/**
 * @method processUploads
 * @param DZ
 * @param repo
 * @param sync
 */
function processUploads(DZ, repo, sync) {
  let uploadFiles = DZ.existingUploads ? DZ.existingUploads : new Array;
  let _files = DZ.getFilesWithStatus(Dropzone.SUCCESS);
  let syncFiles = sync;
  if (_files.length == 0) {
  //  console.log('No Files Attached')
  } else {
    $.each(_files, function (i, row) {
      let json = JSON.parse(row.xhr.response);
      json.name = row.name;
      json.type = row.type;
      json.size = row.size;
      json.bin_id = json.BIN_ID[0];
      delete json.BIN_ID;
      uploadFiles.push(json);
      syncFiles ? updateAttachmentStatus(DZ, json.bin_id, repo, 'keep') : '';
    });
  }
  return uploadFiles;
}

/**
 * @method showUploads
 * @param DZ {object} -the DropZone object.
 * @param id - {string} (target):  the id of the element to render the uploaded file attachments table.
 * @param data {string} - serialized json returned from the event repo (the payload).
 * @param repo {string} - the event repo name that will be used to use in the delete url.
 * @param allowDelete {boolean} - display the delete button?
 * @param showTable {boolean} - display the uploaded file table.
 */
function showUploads(DZ, id, data, repo, allowDelete,showTable) {
  console.log(id, data, showTable);
  /*
  let thisDZ = DZ;
  let _uploads = `<table width='100%' class="table-condensed table-responsive"><thead><tr><th>Name</th><th>Size</th><th>Actions</th></tr></thead><tbody>`;
  thisDZ.existingUploads = data.uploads;
  $.each(data.uploads, function (i, row) {
    let getURL = config.httpHost.app[httpHost] + config.api.upload + config.upload_repo + '/' + row.bin_id + '?sid=' + getCookie(repo+'.sid');
    let getLink = `<button onclick="event.preventDefault();window.open('` + getURL + `')"><span class="glyphicon glyphicon-download"></span></button>`;
    let deleteLink = '<button class="removeUpload" data-id="' + i + '" data-bin="' + row.bin_id + '" ><span class="glyphicon glyphicon-trash"></span></button>';
    let buttons = getLink;
    buttons += allowDelete ? deleteLink : '';
    _uploads += '<tr id="' + row.bin_id + '"><td>' + row.name + '</td><td>' + row.size + '</td><td>' + buttons + '</td></tr>'
  });
  _uploads += `</tbody></table>`;
  $('#' + id).html(_uploads);

  $(".removeUpload").on('click', function () {
    event.preventDefault();
    updateAttachmentStatus(thisDZ, $(this).attr('data-bin'), repo, 'delete', $(this).attr('data-id'));
  });
*/
  /*
   function: showUploads
   parameters:
   id (target):  the id of the element to render the uploaded file attachments table
   data:         serialized json returned from the event repo (the payload)
   repo:         the event repo name that will be used to use in the delete url.
   allowDelete:  display the delete button?
   showTable:    display the uploaded file table.
   */
  let thisDZ = DZ;
  let _uploads=`<table width='100%' class="table-condensed table-responsive"><thead><tr><th>Name</th><th>Size</th><th>Actions</th></tr></thead><tbody>`;
  thisDZ.existingUploads = data[id];
  //thisDZ.emit("addedFile", data[id]);
  $.each(data[id], function(i, row) {
    let getURL = config.httpHost.app[httpHost] + config.api.upload +repo + '/' + row.bin_id + '?sid=' + getCookie(config.default_repo+'.sid');
    let  getLink= `<button onclick="event.preventDefault();window.open('` + getURL + `')"><span class="glyphicon glyphicon-download"></span></button>`;
    let deleteLink = '<button class="removeUpload" data-id="' + i + '" data-bin="'+row.bin_id+'" ><span class="glyphicon glyphicon-trash"></span></button>';
    let buttons = getLink;
    let caption = row.name;
    buttons+= allowDelete ? deleteLink : '';
    _uploads += '<tr id="'+ row.bin_id +'"><td>'+row.name+'</td><td>'+row.size+'</td><td>'+buttons+'</td></tr>'

    //make the thumbnails clickable to view file
    thisDZ.on("addedfile", function(file) {
      file.getURL = getURL;
      file.caption = caption;
      file.previewElement.addEventListener("click", function () {
        window.open(file.getURL);
      });
      //file._captionLabel = Dropzone.createElement("<p>" + file.caption + "</p>")
      //file.previewElement.appendChild(file._captionLabel);

    });
    thisDZ.emit("addedfile", row);
    //add the thumbnail to the dropzone for all files already on the server
    thisDZ.emit("thumbnail", row, getDefaultThumbnail(row.type));
    //console.log('createThumbnailFromUrl',row, getURL)
    thisDZ.createThumbnailFromUrl(row, getURL);
    //set the uploaded file to completed and set the max files for this dropzone.
    thisDZ.emit("complete", row);
    thisDZ.options.maxFiles =thisDZ.options.maxFiles-1;

  });

  _uploads+=`</tbody></table>` ;
  showTable ? $('#'+id+ '_display').html(_uploads):"";

  thisDZ.on("removedfile", function(file){
    updateAttachmentStatus( thisDZ, file.bin_id,repo, 'delete');
  });
  $(".removeUpload").on('click', function () {
    event.preventDefault();updateAttachmentStatus( thisDZ, $(this).attr('data-bin'),repo, 'delete', $(this).attr('data-id'));
  });
}

/**
 * @method getDefaultThumbnail
 * @param stringType {string} file type of uploaded file you want the returned thumbnail
 * @returns {string} location of the thumbnail image
 */
function getDefaultThumbnail(stringType){
  let thumb = "";
  let img_root = "img";
  let type =   stringType.indexOf("/")>-1 ? stringType.split("/")[1]:stringType
  switch(type){
    case "jpeg":
    case "mpeg":
    case "png":
    case "image":
      thumb = img_root +"/imageicon.png";
      break;
    case "mp3":
    case "mp4":
    case "wma":
      thumb = img_root +"/audio.png";
      break;
    case "doc":
      thumb = img_root +"/word.png";
      break;
    case "ppt":
      thumb = img_root +"/ppt.png";
      break;
    case "xsl":
    case "xslx":
    case "csv":
      thumb = img_root +"excelFile.png";
      break;
    case "pdf":
      thumb = img_root +"pdf.png";
      break;
    default:
      thumb = img_root +"default.png";
  }
  return thumb
}
/*
Additional functionality for coreJS
@ToDo merge these methods into a forked branch of coreJS
 */
CotForm.prototype.getData = function () {
  let multi = ['checkbox', 'select-multiple'];
  let data = {}, blanks = {}, rowIndexMap = {}; // {stringIndex: intIndex}
  $.each($('#' + this.cotForm.id).serializeArray(), function (i, o) {
    if (o.name.indexOf('row[') !== -1) {
      let sRowIndex = o.name.substring(o.name.indexOf('[') + 1, o.name.indexOf(']'));
      if (sRowIndex !== 'template') {
        let rows = data['rows'] || [];
        let iRowIndex = rowIndexMap[sRowIndex];
        if (iRowIndex === undefined) {
          rows.push({});
          iRowIndex = rows.length - 1;
          rowIndexMap[sRowIndex] = iRowIndex;
        }
        rows[iRowIndex][o.name.split('.')[1]] = o.value;
        data['rows'] = rows;
      }
    } else {
      if (data.hasOwnProperty(o.name)) {
        data[o.name] = $.makeArray(data[o.name]);
        data[o.name].push(o.value);
      } else {
        data[o.name] = o.value;
      }
    }
  });
  let _blanks = $('#' + this.cotForm.id + ' [name]');
  $.each(_blanks, function () {
    if (data.hasOwnProperty(this.name) && multi.indexOf(this.type) > -1 && !Array.isArray(data[this.name])) {
      data[this.name] = data[this.name].split();
    }
    if (!data.hasOwnProperty(this.name)) {
      blanks[this.name] = '';
    }
  });
  return $.extend(data, blanks);
};
CotForm.prototype.setData = function (data) {
  // STANDARD FIELD OPERATION
  function standardFieldOp(field, val) {
    if (field.length === 1) { // SINGLE FIELD ELMENT
      if (Array.isArray(val)) { // MULTIPLE VALUE ELEMENT - AKA SELECT
        for (let i = 0, l = val.length; i < l; i++) {
          field.find('[value="' + val[i] + '"]').prop('selected', true);
        }
      } else { // STANDARD TEXT-LIKE FIELD
        if (field.is('[type="checkbox"]') || field.is('[type="radio"]')) { // EXCEPT FOR THIS
          if (field.val() === val) {
            field.prop('checked', true);
          }
        } else {
          field.val(val);
        }
      }
    } else { // MULTIPLE FIELD ELEMENT - GROUP OF CHECKBOXS, RADIO BUTTONS
      if (Array.isArray(val)) {
        for (let i = 0, l = val.length; i < l; i++) {
          field.filter('[value="' + val[i] + '"]').prop('checked', true);
        }
      } else { // SINGLE FIELD ELEMENT - STAND ALONE CHECKBOX, RADIO BUTTON
        field.filter('[value="' + val + '"]').prop('checked', true);
      }
    }
    // PLUGIN REBUILD
    field.filter('.multiselect').multiselect('rebuild');
    field.filter('.daterangevalidation').daterangepicker('update');
  }

  // GO THROUGH DATA

  let form = $('#' + this.cotForm.id);
  for (let k in data) {
    if (k === 'rows') { // GRID FIELDS
      for (let i = 0, l = data[k].length; i < l; i++) {
        if (i > 0) { // ADD ROW IF NEEDED
          let fields = $();
          for (let k1 in data[k][i]) {
            fields = fields.add(form.find('[name="row[0].' + k1 + '"]'));
          }
          fields.closest('tr').siblings('tr:last-child').find('button').trigger('click');
        }
        for (let k2 in data[k][i]) { // ASSIGN VALUES
          standardFieldOp(form.find('[name="row[' + i + '].' + k2 + '"]'), data[k][i][k2]);
        }
      }
    } else { // STANDARD FIELDS
      standardFieldOp(form.find('[name="' + k + '"]'), data[k]);
    }
  }
};
