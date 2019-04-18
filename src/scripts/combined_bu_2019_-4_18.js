let notify = false;
function appInitialize() {
  $("#user_auth_title").html("<span style=\"margin-left:4px;\">" + getCookie(config.default_repo + '.cot_uname') + "</span>");

}
/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
let model;
function getSubmissionSections(form_id, data) {
  //console.log(form_id, data)
  let form_data = data;
  let section, registerFormEvents, registerOnSaveEvents;
  switch (form_id) {
    case 'hot_spot':
      section = [
        {
          id: "eventAdminSec",
          title: "Event Administration",
          className: "panel-info",
          rows: [
            {
              fields: [
                {
                  "id": "hs_eventStatus",
                  "bindTo": "hs_eventStatus",
                  "title": "Status",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.eventStatusChoices
                },
                {
                  "id": "hs_eventFeatured",
                  "bindTo": "hs_eventFeatured",
                  "title": "Featured Event",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.eventFeaturedChoices
                },
                {
                  "id": "hs_eventProject",
                  "bindTo": "hs_eventProject",
                  "title": "Project",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.eventProjectChoices
                }
              ]
            }
          ]
        },
        {
          "id": "hs_eventInfoSec",
          "title": "Event Information",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "hs_eventName",
                  "bindTo": "hs_eventName",
                  "title": "Event Name",
                  "type": "text",
                  "required": true
                },
                {"id":"hs_eventStartDate", "title":"Event Start Date", "bindTo":"hs_eventStartDate", "required": true,"type":"datetimepicker", options:{format:config.dateFormat}},
                {"id":"hs_eventEndDate", "title":"Event End Date", "bindTo":"hs_eventEndDate", "required": true,"type":"datetimepicker", options:{format:config.dateFormat}}
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventDescription",
                  "bindTo": "hs_eventDescription",
                  "title": "Event Long Description",
                  "type": "textarea",
                  "rows":8,
                  "posthelptext": "<span id='eventDescriptionLongMax' class='pull-left'></span><span id='eventDescriptionLongMaxLength' class='pull-right'></span>",
                  "htmlAttr": {maxlength: config["long_text_max"]},
                  "required": true
                }
              ]
            },
            {
              fields:[
                {
                  "id": "hs_eventDescriptionShort",
                  "bindTo": "hs_eventDescriptionShort",
                  "title": "Event Short Description/Sample Tweet",
                  "type": "textarea",
                  "posthelptext": "<span id='eventDescriptionShortMax' class='pull-left'></span><span id='eventDescriptionShortMaxLength' class='pull-right'></span>",
                  "htmlAttr": {maxlength: config["short_text_max"]},
                  "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventWebsite",
                  "bindTo": "hs_eventWebsite",
                  "title": "Event Website or Facebook Page",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                },
                {
                  "id": "hs_eventPhone",
                  "bindTo": "hs_eventPhone",
                  "title": "Event Contact Phone",
                  "type": "text",
                  "required": true,
                  "validationtype": "Phone"
                },
                {
                  "id": "hs_eventPhoneExtension",
                  "bindTo": "hs_eventPhoneExtension",
                  "title": "Extension",
                  "type": "text",
                  "required": false
                }

              ]
            },
            {
              fields:
                [

                  {
                    "id": "hs_eventType",
                    "bindTo": "hs_eventType",
                    "title": "Event Type",
                    "type": "checkbox",
                    "orientation": "horizontal",
                    "required": true,
                    "choices": config["eventTypeChoices"],
                  }
                ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventFree",
                  "bindTo": "hs_eventFree",
                  "title": "Free Event?",
                  "orientation": "horizontal",
                  "type": "radio",
                  "choices": [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
                  "required": true
                },
                {
                  "id": "hs_eventTicket",
                  "bindTo": "hs_eventTicket",
                  "title": "Price"
                },
                {
                  "id": "hs_eventFamily",
                  "bindTo": "hs_eventFamily",
                  "title": "Family Friendly",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
                }

              ]
            },

            {
              "fields": [
                {
                  "id": "hs_eventAccessibility",
                  "bindTo": "hs_eventAccessibility",
                  "title": "Accessibility",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": config["eventFeaturesChoices"]
                }
              ]
            }
          ]
        },
        {
          "id": "venueInfoSection",
          "title": "Venue Information",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "venue_start",
                  "type": "html",
                  "html": `<div id="announce" aria-live="polite" class="sr-only well" >announce</div><p>Enter at least one row in the table regarding your event location. The rest of the table rows are optional.</p>`
                }
              ]
            },
            {
              fields:[
                {
                  "id":"event_frequency",
                  "bindTo":"event_frequency",
                  "type":"radio",
                  "title":"Project Frequency",
                  "orientation": "horizontal",
                  "addclass":"event_frequency",
                  "required":"true",
                  "choices":[
                    {"text":"Occurs Once","value":"once"},
                    {"text":"Multiple Dates/Venues","value":"multiple"},
                    {"text":"Recurs Weekly in One Venue","value":"weekly"}
                  ]
                }
              ]
            },
            {
              "repeatControl":{
                "id":"venue",
                "bindTo":"venue",
                "min":1, "max":10, "initial":1,
                "addBtnLabel": "Add Another Venue","removeBtnLabel": "Remove Venue",
                //"setTitle":"Venue Details",
                //"setClassName": "venue_control",
                "addBtnOnClick": function(e) {
                  let target_grid = $(e.target).parentsUntil(".repeatControl").find(".repeatControl-set").last();

                  target_grid.find(".event_frequency input:radio").filter("[value='once']").prop('checked', true).click();
                  target_grid.find(".event_frequency input:radio").removeAttr("aria-describedby");
                  target_grid.find(".addNewDate").click();
                  announce(config.messages.form_controls.add_venue);
                },
                "removeBtnOnClick": function(e) {
                  announce(config.messages.form_controls.remove_venue);},
                "rows":[
                  {
                    "fields":[
                      {"id":"venueName", "bindTo":"venueName", "title":"Venue/Location","required": true},
                      {"id": "venueStreetNumber", "bindTo": "venueStreetNumber", "title": "Street Number", "required": true},
                      {"id": "venueStreetName", "bindTo": "venueStreetName", "title": "Street Name", "required": true},
                      {"id": "venuePostalCode", "bindTo": "venuePostalCode", "title": "Postal Code", "required": true}
                    ]
                  },
                  {
                    "fields": [
                      {"id": "venue_verifiedAddress","bindTo": "venue_verifiedAddress","title": "Verified Address", "disabled":true},
                      {"id": "venue_ward","bindTo": "venue_ward","title": "Ward", "disabled":true},
                      {"id": "venue_latitude","bindTo": "venue_latitude","title": "Lat", "addclass":"hidden"},
                      {"id": "venue_longitude","bindTo": "venue_longitude","title": "Long", "addclass":"hidden"},
                      {"id": "venue_GeoID","bindTo": "venue_GeoID","title": "Geo ID", "addclass":"hidden"},
                      {"id": "venue_matchType","bindTo": "venue_matchType","title": "MatchType", "addclass":"hidden"},
                      {"id": "venue_lookup","type":"button","title":"Verify","addclass":"vlookup","onclick":function(e){console.log(e);}}
                    ]
                  },
                  {
                    "fields":[
                      {"id": "projectDate", "bindTo": "projectDate", "title": "Date", "addclass": "project", "type": "datetimepicker", "required": true, "options":{format:config.dateFormat}},
                      {"id": "projectDescription", "bindTo": "projectDescription", "title": "Description", "addclass": "project", "type": "textarea", "required": true,}
                    ]
                  },
                  {
                    "fields":[
                      {"id":"weeklyStartTime", "bindTo":"weeklyStartTime", "title":"Start Time","required": true,"type":"datetimepicker", "glyphicon": 'glyphicon glyphicon-time', options:{format:'LT'}},
                      {"id":"weeklyEndTime", "bindTo":"weeklyEndTime","title":"End Time", "required": true,"type":"datetimepicker", "glyphicon": 'glyphicon glyphicon-time', options:{format:'LT'}}
                    ]
                  },
                  {
                    "fields":[
                      {"id":"dayOfWeek", "bindTo":"dayOfWeek", "title":"Day of Week", "addclass":"day_of_week", "type": "dropdown", "required": true, "choices":config.days_of_week},
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          "id":"photo_upload_sec",
          "title": "Photo",
          "className": "panel-info",
          "rows":[
            {
              "fields": [
                {
                  "id": "docsIntro",
                  "title": "File Attachments",
                  "type": "html",
                  "html": `<section id="attachment">
                    <h4>Photo</h4>
                        <div class="dropzone" id="uploaded_files"></div>
                    </section>
                    <section id="uploaded_files_display"></section>`
                }
              ]
            }
          ]
        },
        {
          "id": "hs_orgInfoSec",
          "title": 'Organization Information',
          "className": "panel-info",
          "rows": [
            {
              "fields": [{
                "id": "hs_organizationInfoHeader",
                "type": "html",
                "html": config["organizationInfoHeader"]
              }]
            },
            {
              "fields": [
                {"id": "hs_orgName", "bindTo": "hs_orgName", "title": "Organization Name", "required": true},
                {
                  "id": "hs_orgWebsite",
                  "bindTo": "hs_orgWebsite",
                  "title": "Website",
                  "validators": {uri: {message: 'The website address is not valid', allowEmptyProtocol: true}}
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_orgFacebook",
                  "bindTo": "hs_orgFacebook",
                  "title": "Facebook",
                  "validators": {uri: {message: 'The website address is not valid', allowEmptyProtocol: true}}
                },
                {
                  "id": "hs_orgTwitter",
                  "bindTo": "hs_orgTwitter",
                  "title": "Twitter",
                  "validators": {uri: {message: 'The website address is not valid', allowEmptyProtocol: true}}
                },
                {
                  "id": "hs_orgInstagram",
                  "bindTo": "hs_orgInstagram",
                  "title": "Instagram",
                  "validators": {uri: {message: 'The website address is not valid', allowEmptyProtocol: true}}
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_orgDescription",
                  "bindTo": "hs_orgDescription",
                  "title": "Description",
                  "type": "textarea",
                  "rows":8,
                  "required": true,
                  "htmlAttr": {maxlength: config["long_text_max"]},
                  "prehelptext": config["orgDescriptionHelp"],
                  "posthelptext": "<span id='orgDescriptionMax' class='pull-left'></span><span id='orgDescriptionMaxLength' class='pull-right'></span>"
                }
              ]
            }
          ]
        },
        {
          "id": "hs_contactInfoSec",
          "title": "Contact Information",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "hs_priContactName",
                  "bindTo": "hs_priContactName",
                  "title": "Contact Name",
                  "type": "text",
                  "required": true,
                  "className": ""
                },
                {
                  "id": "hs_priContactPos",
                  "bindTo": "hs_priContactPos",
                  "title": "Contact Position",
                  "type": "text",
                  "required": true,
                  "className": ""
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_priContactEmail",
                  "bindTo": "hs_priContactEmail",
                  "title": "Contact Email",
                  "type": "text",
                  "required": true,
                  "validationtype": "Email"
                },
                {
                  "id": "hs_priContactPhone",
                  "bindTo": "hs_priContactPhone",
                  "title": "Contact Phone",
                  "type": "text",
                  "required": true,
                  "validationtype": "Phone"
                },
                {
                  "id": "hs_priContactExtension",
                  "bindTo": "hs_priContactExtension",
                  "title": "Extension",
                  "type": "text"
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_preSubmitDetails",
                  "type": "html",
                  "html": config["preSubmitDetails"]
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventAuthName",
                  "bindTo": "hs_eventAuthName",
                  "title": "Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "hs_eventAuthTitle",
                  "bindTo": "hs_eventAuthTitle",
                  "title": "Title",
                  "type": "text",
                  "required": true
                }
              ]
            }
          ]
        },
        {
          "id": "hs_secActions",
          "rows": [
            {
              "fields": [
                {
                  "id": "saveReport",
                  "title": config.button.saveReport,
                  "type": "html",
                  "html": "<button class=\"btn btn-success btn-save\" id=\"save\"><span class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span> " + config.button.saveReport + "</button>",
                  "class": "pull-left"
                }
              ]
            }
          ]
        }
      ];
      model = new CotModel({
        "hs_eventName": "",
        "hs_eventStartDate":"",
        "hs_eventEndDate":"",
        "hs_eventFree": "",
        "hs_eventTicket":"",
        "hs_eventDescriptionShort": "",
        "hs_eventDescription": "",
        "hs_eventPhotoCredit": "",
        "hs_eventWebsite": "",
        "hs_eventPhone": "",
        "hs_eventPhoneExtension": "",
        "hs_eventType": [""],
        "hs_eventAccessibility": "",
        "hs_eventFamily": "",
        "event_frequency":"",
        "hs_orgName": "",
        "hs_orgWebsite": "",
        "hs_orgFacebook": "",
        "hs_orgTwitter": "",
        "hs_orgInstagram": "",
        "hs_orgDescription": "",
        "hs_priContactName": "",
        "hs_priContactPos": "",
        "hs_priContactEmail": "",
        "hs_priContactPhone": "",
        "hs_priContactExtension": "",
        "hs_eventAuthName": "",
        "hs_eventAuthTitle": "",
        "hs_eventStatus": "",
        "SubmissionStatus": "",
        "uploaded_files": [],
        "venue":new CotCollection([]),
        "hs_eventFeatured":"",
        "hs_eventProject":"",

      });
      registerFormEvents = function () {
        dropzones["uploaded_files"].on('success', function(){processForm('', config.default_repo,hasher.getHashAsArray()[0], hasher.getHashAsArray()[1] ==="new" ? null : hasher.getHashAsArray()[1]);});

        $("#maincontent").off('click','.exprtPDF').on('click','.exprtPDF',function () {
          printPDF(
            $("#viewtitle").text(),
            "Hotspot",
            "Cultural Events Program",
            "City of Toronto",
            $("#viewtitle").text()+ ".pdf",
            data
          );
        } );
        $("#maincontent").off('click', '#venue .vlookup button').on('click' , '#venue .vlookup button' ,function(e){
          let target_grid = $(e.target).parentsUntil(".repeatControl-set-rows");
          let grid_id = target_grid.find(".vlookup").attr("id").substring(0,target_grid.find(".vlookup").attr("id").indexOf("_venue_")+6);
          let lookup = $("#" + grid_id + "StreetNumber").val() +  "  " + $("#" + grid_id + "StreetName").val();
          addressLookup(lookup, "", grid_id)
        });

        $("#form_pane")
          .off('change', ".event_frequency input:radio")
          .on('change', ".event_frequency input:radio", function (e){
            let selected = $(this).val();
            let target_grid = $(e.target).parentsUntil(".repeatControl-set");
            announce(config.messages.form_controls.toggle_event[selected]);
          });
        $("#form_pane")
          .off('click', ".event_frequency input:radio")
          .on('click', ".event_frequency input:radio", function (e){

            let selected = $(this).val();
            let target_grid = $(e.target).parentsUntil(".repeatControl-set");

            if(selected==="weekly"){

              target_grid.find(".day_of_week").show();
              target_grid.find(".project").hide();

              $(".repeatControl-set-button").hide();
              $(".repeatControl-button").hide();
            }
            else if(selected==="once"){

              target_grid.find(".day_of_week").hide();
              target_grid.find(".project").hide();
              $(".repeatControl-set-button").hide();
              $(".repeatControl-button").hide();
            }
            else{
              target_grid.find(".project").show();
              target_grid.find(".day_of_week").hide();
              let index = $(this).attr("id").split("_");
              $(".repeatControl-set-button").show();
              $(".repeatControl-button").show();
            }
          });

        if(data){
          $("input[name='event_frequency']:checked").click();
          //$(data.venue).each(function(i, repeat){ });
        }else{
          //console.log("set default grid")
          $(".event_frequency input:radio").filter("[value='once']").prop('checked', true).click();
        }

      };
      registerOnSaveEvents = function(payload){
        if(payload.hs_eventStatus==="Approved"){
          loadBabies(payload.id,processEvent(payload));
        }else if(payload.id){
          clearBabies(payload.id)
        }
      }
      break;
    case 'hot_eats':
      section = [
        {
          id: "eventAdminSec",
          title: "Event Administration",
          className: "panel-info",
          rows: [
            {
              fields: [
                {
                  "id": "he_eventStatus",
                  "bindTo": "he_eventStatus",
                  "title": "Status",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.eventStatusChoices
                },
                {
                  "id": "he_receivied",
                  "bindTo": "he_receivied",
                  "title": "Receivied",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": config.yesNoRadio
                },
                {
                  "id": "he_awarded",
                  "bindTo": "he_awarded",
                  "title": "Awarded",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": config.yesNoRadio
                }
              ]
            },
            {
              fields: [
                {
                  "id": "he_verifiedAddress",
                  "bindTo": "he_verifiedAddress",
                  "title": "Verified Address"
                },
                {
                  "id": "he_latitude",
                  "bindTo": "he_latitude",
                  "title": "Lat"
                },
                {
                  "id": "he_longitude",
                  "bindTo": "he_longitude",
                  "title": "Long"
                },
                {
                  "id": "he_ward",
                  "bindTo": "he_ward",
                  "title": "Ward"
                },

                {
                  "id": "venue_location",
                  "type": "html",
                  "html": `<div id="vLookup" data-id="" data-prefix="he" class="btn btn-success vLookup">Location Lookup</div><input type="hidden" name="he_geoID" id="he_geoID" value=""/><input type="hidden" name="he_matchType" id="he_matchType" value=""/>`
                }
              ]
            }
          ]
        },
        {
          "id": "RestaurantInfoSec",
          "title": 'Restaurant Information',
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "he_restaurantName",
                  "bindTo": "he_restaurantName",
                  "title": "Restaurant Name",
                  "required": true
                },
              ]
            },
            {
              "fields": [
                {"id": "he_streetNumber", "bindTo": "he_streetNumber", "title": "Street Number", "required": true},
                {"id": "he_streetName", "bindTo": "he_streetName", "title": "Street Name", "required": true},
                {"id": "he_postalCode", "bindTo": "he_postalCode", "title": "Postal Code", "required": true}
              ]
            },
            {
              "fields": [
                {
                  "id": "he_phone",
                  "bindTo": "he_phone",
                  "title": "Phone",
                  "required": true,
                  "validationtype": "Phone"
                },
                {
                  "id": "he_email",
                  "bindTo": "he_email",
                  "title": "Email",
                  "required": false,
                  "validationtype": "Email"
                },
                {
                  "id": "he_website",
                  "bindTo": "he_website",
                  "title": "Website",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                },
              ]
            },
            {
              "fields": [
                {
                  "id": "he_facebook",
                  "bindTo": "he_facebook",
                  "title": "Facebook",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                },
                {
                  "id": "he_twitter",
                  "bindTo": "he_twitter",
                  "title": "Twitter",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                },
                {
                  "id": "he_instagram",
                  "bindTo": "he_instagram",
                  "title": "Instagram",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_category",
                  "bindTo": "he_category",
                  "title": "Type",
                  "required": true,
                  "type": "radio",
                  "choices": config.restaurant_type,
                  "orientation": "horizontal",
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_typesOfFood",
                  "bindTo": "he_typesOfFood",
                  "title": "Cuisine",
                  "required": true,
                  "type": "checkbox",
                  "choices": config.cuisine,
                  "orientation": "horizontal", "multiple": true,
                }
              ]
            },
            {
              "fields":[
                {
                  "id": "he_typesOfFoodOther",
                  "bindTo": "he_typesOfFoodOther",
                  "title": "Other Cuisine Type",
                  "required": false,
                  "addclass":"cuisine_other col-xs-12 col-sm-6"
                }
              ]
            },
            {
              "fields":[
                {
                  "id": "he_services",
                  "bindTo": "he_services",
                  "title": "Features",
                  "required": true,
                  "type": "checkbox",
                  "choices": config.services,
                  "orientation": "horizontal", "multiple": true,
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_priceRange",
                  "bindTo": "he_priceRange",
                  "title": "Average price of a meal, including non-alcoholic drink",
                  "required": true,
                  "type": "radio",
                  "choices": config.priceRange,
                  "orientation": "horizontal"
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_eventDescription",
                  "bindTo": "he_eventDescription",
                  "title": "Description of your business/ Sample tweet",
                  "posthelptext": "<span id='eventDescriptionShortMax' class='pull-left'></span><span id='eventDescriptionShortMaxLength' class='pull-right'></span>",
                  "htmlAttr": {maxlength: config.short_text_max},
                  "type": "textarea", "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_accessibility",
                  "bindTo": "he_accessibility",
                  "title": "Accessibility",
                  "type": "radio",
                  "required": true,
                  "choices": config.accessibility,
                  "orientation": "horizontal"
                }
              ]
            }
          ]
        },
        {
          "id":"photo_upload_sec",
          "title": "Photo",
          "className": "panel-info",
          "rows":[
            {
              "fields": [
                {
                  "id": "docsIntro",
                  "title": "File Attachments",
                  "type": "html",
                  "html": `<section id="attachment">
                    <h4>Photo</h4>
                        <div class="dropzone" id="uploaded_files"></div>
                    </section>
                    <section id="uploaded_files_display"></section>`
                }
              ]
            }
          ]
        },
        {
          "id": "ContactInfoSec",
          "title": "Contact Info",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "he_firstName",
                  "bindTo": "he_firstName",
                  "title": "First Name",
                  "type": "text",
                  "required": true,
                  "className": ""
                },
                {
                  "id": "he_lastName",
                  "bindTo": "he_lastName",
                  "title": "Last Name",
                  "type": "text",
                  "required": true,
                }
              ]
            }, {
              "fields": [
                {
                  "id": "he_contactRole",
                  "bindTo": "he_contactRole",
                  "title": "Role",
                  "type": "radio",
                  "required": true,
                  "choices": config.contactRole,
                  "orientation": "horizontal"
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_businessPhone",
                  "bindTo": "he_businessPhone",
                  "title": "Business Telephone Number",
                  "type": "text",
                  "required": false,
                  "validationtype": "Phone"
                },
                {
                  "id": "he_businessEmail",
                  "bindTo": "he_businessEmail",
                  "title": "Business Email",
                  "type": "text",
                  "required": true,
                  "validationtype": "Email"
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_authorization",
                  "bindTo": "he_authorization",
                  "title": "Authorization",
                  "type": "radio",
                  "choices": config.authorization,
                  "orientation": "horizontal", "required": true
                }
              ]
            }
          ]
        },
        {
          "id": "GiftCertSec",
          "bindTo": "GiftCertSec",
          "title": "Gift Certificate",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "he_giftCertificate",
                  "bindTo": "he_giftCertificate",
                  "title": "Gift Certificate",
                  "type": "radio",
                  "choices": config.gift_certificate
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "he_giftCertificate_next",
                  "bindTo": "he_giftCertificate_next",
                  "title": "Gift Certificate",
                  "type": "radio",
                  "choices": config.gift_certificate_next
                }
              ]
            }
          ]
        },
        {
          "id": "hs_secActions",
          "rows": [
            {
              "fields": [
                {
                  "id": "saveReport",
                  "title": config.button.saveReport,
                  "type": "html",
                  "html": "<div class=\"btn-group\" role=\"group\" aria-label=\"Form Action Button Group\"><button class=\"btn btn-success btn-save\" id=\"save\"><span class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span> " + config.button.saveReport + "</button></div>",
                  "class": ""
                }
              ]
            }
          ]
        }
      ];
      model = new CotModel({
        "he_restaurantName": "",
        "he_streetNumber": "",
        "he_streetName": "",
        "he_postalCode": "",
        "he_phone": "",
        "he_email": "",
        "he_website": "",
        "he_facebook": "",
        "he_twitter": "",
        "he_instagram": "",
        "he_category": "",
        "he_services": "",
        "he_typesOfFood": "",
        "he_typesOfFoodOther":"",
        "he_priceRange": "",
        "he_eventDescription": "",
        "he_accessibility": "",
        "he_firstName": "",
        "he_lastName": "",
        "he_contactRole": "",
        "he_businessPhone": "",
        "he_businessEmail": "",
        "he_authorization": "",
        "he_giftCertificate": "",
        "he_eventStatus": "Pending",
        "he_ward":"",
        "he_longitude":"",
        "he_latitude":"",
        "he_verifiedAddress":"",
        "he_loops":"",
        "he_awarded":"",
        "he_receivied":"",
        "uploaded_files":[]

      });
      registerFormEvents = function () {
        $('#eventDescriptionShortMax').html(config.short_text_max + ' characters maximum ');
        //$('#eventDescriptionShortMaxLength').html(config.short_text_max - data.he_eventDescription.length  + ' characters remaining ');
        $('#he_eventDescription').keyup(function () {
          $('#eventDescriptionShortMaxLength').html(config.short_text_max - $(this).val().length + ' remaining ');
        });
        $("[name='he_typesOfFood']").parent(".checkboxLabel").wrap("<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2' />");
        $("[name='he_services']").parent(".checkboxLabel").wrap("<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2' />");
        if(data.he_typesOfFood.indexOf("Other")>-1){
          $(".cuisine_other").show();
        }else{$(".cuisine_other").hide();}

        $("#form_pane").off('change', "input[name=he_typesOfFood]").on('change', "input[name=he_typesOfFood]", function () {
          if ($(this).val() === "Other" && $(this).is(":checked")) {
            $(".cuisine_other").show();
          } else {
            $(".cuisine_other").hide();
          }
        });

      };
      break;

  }
  return [section, model, registerFormEvents, registerOnSaveEvents];
}

function getColumnDefinitions(formName, filter) {
  let columnDefs, view;
  switch (formName) {
    case'hot_spot':
      columnDefs = [
        {
          "targets": 0,
          "checkboxes": {"selectRow": true},
          "data": "id",
          "createdCell": function (td, cellData, rowData) {
          }
        },
        {"data": "hs_eventName", "title": "Event Name", "filter": true, "type":"text","sortOrder": "asc"},
        {
          "data": "hs_eventStatus", "title": 'Status',"filter": true,"sortOrder": "asc","restrict": filter["hs_eventStatus"],"filterChoices": config.eventStatusFilter
        },
        {"data": "__CreatedOn", "title": "Received", "filter": true, "type":"date","sortOrder": "asc",render:function(data){return moment(data).format(config.dateTimeFormat)}},
        {
          "data": "hs_eventProject",
          "title": "Project",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventProjectFilter
        },
        {
          "data": "hs_eventFeatured",
          "title": "Featured",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventFeaturedFilter
        },
        {
          "data": "hs_eventType",
          "title": "Type",
          "filter": true,
          "isArray": true,
          "orderable": false,
          "filterChoices": config.eventTypeFilter
        },
        {
          "data": "hs_eventAccessibility",
          "title": "Accessible",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventFeaturesFilter
        },
        {
          "data": "hs_eventFamily",
          "title": "Family?",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventYesNoFilter
        },
        {
          "data": "hs_eventFree",
          "title": "Free?",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventYesNoFilter
        }
      ];
      view = "hot_spot";
      break;
    case'hot_eats':
      columnDefs = [
        {
          "targets": 0,
          "checkboxes": {"selectRow": true},
          "data": "id",
          "createdCell": function (td, cellData, rowData) {
            //console.log('a', td, 'b', cellData, 'c', rowData)
          }
        },
        {"data": "he_restaurantName", "title": "Restaurant Name", "filter": false, "sortOrder": "asc"},
        {
          "data": "he_eventStatus",
          "title": 'Status',
          "filter": true,
          "sortOrder": "asc",
          "restrict": filter["he_eventStatus"],
          "filterChoices": config.eventStatusFilter
        },
        {"data":"he_receivied", "title":"Received" ,"filter":true,"filterChoices":["Yes", "No"]},
        {"data":"he_awarded", "title":"Certificate Awarded" ,"filter":true,"filterChoices":["Yes", "No"]},
        {"data":"he_ward", "title":"Ward" ,"filter":true, "filterChoices":config.wards},
        {"data":"he_category", "title":"Type" ,"filter":true,"filterChoices":$.map(config.restaurant_type, function(n){return n.value})}
      ];
      view = "hot_eats";
      break;
    case'event_baby':
      columnDefs = [
        {
          "targets": 0,
          "checkboxes": {"selectRow": true},
          "data": "id",
          "createdCell": function (td, cellData, rowData) {
          }
        },
        {"data": "startDate", "title": "Sort Date", "sortOrder": "asc","visible": false},
        {"data": "hs_eventName", "title": "Event Name", "filter": true, "type":"text"},
        {"data": "hs_eventType", "title": "Event Type", "filter": false, "isArray":true,"type":"text"},
        {"data": "startDate", "title": "Start Date", "filter": true, "type":"date",render:function(data){return moment(data).format(config.dateTimeFormat)}},
        {"data": "endDate", "title": "End Date", "filter": true, "type":"date",render:function(data){return moment(data).format(config.dateTimeFormat)}},
        {"data": "hs_eventVenueName", "title": "Venue Name", "filter": true, "type":"text"},
        {"data": "hs_verifiedAddress", "title": "Location", "filter": true, "type":"text"},
        {"data": "hs_eventFree", "title": "Free", "filter": true, "type":"text"},
        {"data": "hs_eventTicket", "title": "Price", "filter": true, "type":"text"},
        {"data": "hs_eventVenueName", "title": "Venue Name", "filter": true, "type":"text"},
        {"data": "hs_verifiedAddress", "title": "Venue Location", "filter": true, "type":"text"},
        {"data": "hs_eventDescriptionShort", "title": "Short Description", "filter": true, "type":"text"},
        {"data": "hs_eventDescription", "title": "Long Description", "filter": true, "type":"text"},
      ];
      view = "event_baby";
      break;
    default:
      break;
  }
  return [columnDefs, view];
}

function registerEvents() {

  $("#maincontent").off('click', '#tabExportCSV').on('click', '#tabExportCSV', function () {
    $(".dt-button.buttons-csv.buttons-html5").click();
  })
  $("#maincontent").off('click', '#tabExportEXCEL').on('click', '#tabExportEXCEL', function () {
    $(".dt-button.buttons-excel.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportPDF').on('click', '#tabExportPDF', function () {
    $(".dt-button.buttons-pdf.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportCopy').on('click', '#tabExportCopy', function () {
    $(".dt-button.buttons-copy.buttons-html5").click();
  });

  // Create New Entry button
  $("#maincontent").off('click', '.btn-createReport').on('click', '.btn-createReport', function () {
    hasher.setHash($(this).attr('data-id') + '/new/?ts=' + new Date().getTime());
  });


  // Print button
  $("#maincontent").off('click', '#btn-print').on('click', '#btn-print', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.print();
  });

  // Navigation tab links by report status
  $("#maincontent").off('click', '.tablink').on('click', '.tablink', function () {
    hasher.setHash($(this).attr('data-id') + '?ts=' + new Date().getTime() + '&status=' + $(this).attr('data-status') + '&filter=' + $(this).attr('data-filter'));
  });

  $("#maincontent").off('click', '.vLookup').on('click', '.vLookup', function (e) {
    console.log("click vlookup main register events")
    e.stopPropagation();
    e.preventDefault();
    let eventType = $(this).attr('data-prefix');
    let query = "";
    console.log('lookup', $(this).attr('data-id'), $('#hs_venueAddress' + $(this).attr('data-id')).val(), $(this).attr('data-prefix'));
    if (eventType === "hs") {
      query = $('#hs_venueAddress' + $(this).attr('data-id')).val();
    } else {
      query = $('#he_streetNumber').val() + " " + $('#he_streetName').val();
    }
    if (query && query.trim() !== "") {
      addressLookup(query, $(this).attr('data-id'), eventType)
    }
    else {
      bootbox.alert('Address is required to search against.')
    }
  });

  // View / Edit report button
  $("#maincontent").off('click', '.btn-view-edit-report').on('click', '.btn-view-edit-report', function () {
    hasher.setHash($(this).parents('tr').attr('data-formName') + '/' + $(this).parents('tr').attr('data-id') + '?ts=' + new Date().getTime());
  });
  $("#maincontent").off("input", "#admin_search").on("input","#admin_search", function () {
    $("#btn-adminSearch").find('i').removeClass('glyphicon glyphicon-refresh').addClass('glyphicon glyphicon-search');
    myDataTable.dt.search(this.value).draw();
  });
  $("#maincontent").off("click", ".btn-deleteSelected").on("click", ".btn-deleteSelected", function (e) {

    let collectionName = hasher.getHashAsArray()[0].substring(0, hasher.getHashAsArray()[0].indexOf('?'))
    collectionName = collectionName ===""?   hasher.getHashAsArray()[0]:collectionName;
    bootbox.confirm({
      size: "small",
      message: "Are you sure you want to DELETE Selected?",
      callback: function (result) {

        if (result === true) {

          bootbox.prompt("Please type CONFIRM to proceed with deletion:", function(result){
            if(result==="CONFIRM"){
              let collection = myDataTable.getSelected();
              $.each(collection, function(i,val){
                deleteReport(val.id, collectionName,null);
              });
              myDataTable.dt.ajax.reload(null, false);
              myDataTable.dt.column(0).checkboxes.deselectAll();
            }
            else{bootbox.alert("Input did not match \"CONFIRM\" - No action taken")}
          });
        }
      }
    })
    e.preventDefault();
  });

  $("#maincontent").off("click", ".btn-delete").on("click", ".btn-delete", function (e) {
    let fid = hasher.getHashAsArray()[1];
    let formName = hasher.getHashAsArray()[0]
    bootbox.confirm({
      size: "small",
      message: "Are you sure you want to DELETE entity?",
      callback: function (result) {
        if (result === true) {
          //deleteReport(fid, formName);
          console.log(fid, formName);
          deleteReport(fid, formName, function(success){
            if(success===true){
              bootbox.alert("Entity Deleted", function(){toggleView("view_pane")})
            }else{bootbox.alert("FAILED: Entity NOT Deleted")}
          });

        }
      }
    })
    e.preventDefault();
  });
}

/**
 * @method addressLookup
 * @param lookup {string} - Address to lookup to the GEO Service
 * @param venue_id - {string} - venue fieldset identifier
 * @param prefix
 * @dependicies bootbox.js, datatables.js
 */
function addressLookup(lookup, venue_id, prefix) {
  let dialog = bootbox.dialog({
    title: 'Toronto Address Lookup for: ' + lookup,
    message: '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>',
    size: 'large'
  });
  let url = "//map.toronto.ca/geoservices/rest/search/rankedsearch?searchArea=1&matchType=1&projectionType=1&searchString=" + lookup;
  dialog.init(function () {
    $.getJSON(encodeURI(url), function (data) {
      let template = "<table id=\"best\" class=\"table table-striped table-bordered\" cellspacing=\"0\" width=\"100%\" ><thead><tr><th></th><th></th><th></th></tr></thead></table>";
      dialog.find('.bootbox-body').html('Select the correct address from the list.' + template);
      $('#best').DataTable({
        "data": $.merge($.merge(data.result.restOfResults, data.result.likelyResults), data.result.bestResult),
        "dom": "<'row'><'row'<'col-sm-12'tr>><'row'>",
        "order": [[0, "desc"]],
        "columns": [
          {"title": "Score", "data": "score", "visible": false},
          {"title": "Name", "data": "key_Desc"},
          {"title": "Position", "data": "detail"}
        ]
      });

      var table = $("#best").DataTable();

      $('#best tbody').on("click", "tr", function () {
        var data = table.row(this).data();
        var postfix = venue_id === "" ? "" : "_" + venue_id;
        //console.log(data, lookup, 'venue_id:', venue_id, 'prefix:', prefix, 'postfix:', postfix, ' lat:', data["latitude"], '$("#"+prefix+"venueLat"+ postfix)', $("#" + prefix + "venueLat" + postfix))

        $("#" + prefix + "_verifiedAddress" + postfix).val(data["key_Desc"]).change();
        if (prefix === "hs") {
          $("#" + prefix + "_venueLat" + postfix).val(data["latitude"]).change();
          $("#" + prefix + "_venueLong" + postfix).val(data["longitude"]).change();
        } else {
          $("#" + prefix + "_latitude").val(data["latitude"]).change();
          $("#" + prefix + "_longitude").val(data["longitude"]).change();
        }

        $("#" + prefix + "_ward" + postfix).val(data["detail"].indexOf("Ward:") > -1 ? data["detail"].substring(data["detail"].indexOf("Ward:") + 6, data["detail"].length) : "").change();
        $("#" + prefix + "_geoID" + postfix).val(data["geoID"]).change();
        $("#" + prefix + "_matchType" + postfix).val(data["matchType"]).change();
        dialog.find(".bootbox-body").html("");
        dialog.modal("hide");
      });
    });
  })
}

function announce(message){
  if(notify===true){
    $("#announce").html(message);
  }
}

function processEvent(payload){
  // console.log('processEvent - payload', payload);
  let eStartDate = moment(payload.hs_eventStartDate), eEndDate = moment(payload.hs_eventEndDate);
  var result = [];
  let locations = [];
  if(payload && payload.id){
    $(payload.venue).each(function(i, repeat){
      if(payload.event_frequency==="weekly"){

        var current = eStartDate.clone();

        while (current.day(7 + parseInt(repeat.dayOfWeek)).isBefore(eEndDate)) {
          let baby  = {};
          //console.log(current.format("YYYY-MM-DD") +  " " + repeat.weeklyStartTime );

          baby.startDate = moment(current.format("YYYY-MM-DD") +  " " + repeat.weeklyStartTime, "YYYY-MM-DD hh:mm a" ).format();
          baby.endDate = moment(current.format("YYYY-MM-DD") +  " " + repeat.weeklyEndTime, "YYYY-MM-DD hh:mm a" ).format();
          baby = makeBaby(baby, payload, repeat);
          result.push(baby);
        }
        // console.log(result)
      }
      else if(payload.event_frequency==="once"){
        let baby  = {};
        baby.startDate = moment(payload.hs_eventStartDate +  " " + repeat.weeklyStartTime, "YYYY-MM-DD hh:mm a" ).format();
        baby.endDate = moment(payload.hs_eventEndDate +  " " + repeat.weeklyEndTime, "YYYY-MM-DD hh:mm a" ).format();
        baby = makeBaby(baby, payload, repeat);
        result.push(baby);
      }
      else{
        let baby  = {};
        //console.log(moment(repeat.projectDate, "MM/DD/YYYY").format("YYYY-MM-DD")  ,repeat.weeklyStartTime);

        baby.startDate = moment(repeat.projectDate +  " " + repeat.weeklyStartTime, "YYYY-MM-DD hh:mm a" ).format();
        baby.endDate = moment(repeat.projectDate +  " " + repeat.weeklyEndTime, "YYYY-MM-DD hh:mm a" ).format();
        baby = makeBaby(baby, payload, repeat);
        result.push(baby);

      }
    });
  }
  else{}
  return result;
}
function makeBaby(baby, payload, repeat){
  let photo;
  $.each(payload.uploaded_files, function(i, val){
    //console.log('photo',i, val,val.status)
    if(val.status==="publish"){
      photo = val;
      return false;

    }
  });
  //console.log('photo',photo)
  if(photo){
    // console.log(photo.description);
  }//do nothing
  else{
    photo = {};
    photo.published = {};
    photo.published.url = config.default_photo_published;
    photo.credit = config.default_photo_credit;
    photo.description = config.default_photo_description;
  }

  let projecttext = "";
  if(payload.event_frequency==="weekly"){projecttext = ""}
  else if(payload.event_frequency==="once"){projecttext = ""}
  else{projecttext=repeat.projectDescription}
  //console.log(photo.credit, photo);
  let datetext = "";
  //let datetext = moment(baby.startDate).format("dddd, MMMM Do, h:mm a") + " to "  + moment(baby.endDate).format("dddd, MMMM Do, h:mm a");


  if(moment(baby.startDate).isSame(baby.endDate, "day"))
  {
    datetext = moment(baby.startDate).format("dddd, MMMM Do h:mm A") + " to "  + moment(baby.endDate).format("h:mm A");
    //console.log("same day", baby.startDate,baby.endDate)

  }
  else{
    datetext = moment(baby.startDate).format("dddd, MMMM Do h:mm A") + " to "  + moment(baby.endDate).format("dddd, MMMM Do h:mm A");
    //console.log("NOT same day", baby.startDate,baby.endtDate)

  }

  /*
 if(moment(baby.endDate).isBefore(baby.startDate, "day")){console.log("before", baby.startDate,baby.endDate)}
   else{console.log("NOT before", baby.startDate,baby.endtDate)}

   console.log(baby.startDate);
   */
//console.log(moment(baby.endDate).isSame(baby.endDate, "day") && moment(baby.endDate).isBefore(baby.startDate))


  baby.hs_event_frequency = payload.event_frequency;
  baby.hs_documentID = payload.id;
  baby.hs_eventStartDate = payload.hs_eventStartDate;
  baby.hs_eventEndDate = payload.hs_eventEndDate;
  baby.hs_eventAccessibility = payload.hs_eventAccessibility;
  baby.hs_eventDescription = payload.hs_eventDescription;
  baby.hs_eventDescriptionShort = payload.hs_eventDescriptionShort;
  baby.hs_eventFaceBook = payload.hs_orgFacebook;
  baby.hs_eventFamily = payload.hs_eventFamily;
  baby.hs_eventFree = payload.hs_eventFree;
  baby.hs_eventInstagram = payload.hs_orgInstagram;
  baby.hs_eventName = payload.hs_eventName;
  baby.hs_eventPhone = payload.hs_eventPhone;
  baby.hs_eventPhoto = photo.published.url;
  baby.hs_eventPhotoCredit = photo.credit;
  baby.hs_eventPhotoDescription = photo.description;
  baby.hs_eventTicket = payload.hs_eventTicket;
  baby.hs_eventTwitter = payload.hs_orgTwitter;
  baby.hs_eventType = payload.hs_eventType;
  baby.hs_eventVenueName = repeat.venueName;
  baby.hs_eventWebsite = payload.hs_orgWebsite;
  baby.hs_featureEvent = payload.hs_eventFeatured;
  baby.hs_orgDescription = payload.hs_orgDescription;
  baby.hs_orgFaceBook = payload.hs_orgFacebook;
  baby.hs_orgInstagram = payload.hs_orgInstagram;
  baby.hs_orgLat = repeat.venue_latitude;
  baby.hs_orgLong = repeat.venue_longitude;
  baby.hs_verifiedAddress = repeat.venue_verifiedAddress;
  baby.hs_orgName = payload.hs_orgName;
  baby.hs_orgPhone = payload.hs_priContactPhone;
  baby.hs_orgTwitter = payload.hs_orgTwitter;
  baby.hs_orgWebsite = payload.hs_orgWebsite;
  baby.hs_eventStatus = payload.hs_eventStatus;
  baby.hs_tester = payload.hs_eventAccessibility;
  baby.locations = [
    {
      "startDate":baby.startDate,
      "endDate":baby.endDate,
      "location":repeat.venue_verifiedAddress,
      "latitude":repeat.venue_latitude,
      "longitude":repeat.venue_longitude,
      "datetext":datetext,
      "projecttext":projecttext,
      "venue":repeat.venueName
    }
  ];
  return baby;
  /*
    baby.hs_eventAccessibility = payload.hs_eventAccessibility;
    baby.hs_eventAuthName = payload.hs_eventAuthName;
    baby.hs_eventAuthTitle = payload.hs_eventAuthTitle;
    baby.hs_eventFaceBook = payload.hs_eventFaceBook;
    baby.hs_eventFamily = payload.hs_eventFamily;
    baby.hs_eventFeatured = payload.hs_eventFeatured;
    baby.hs_eventFree = payload.hs_eventFree;
    baby.hs_eventInstagram = payload.hs_eventInstagram;
    baby.hs_eventName = payload.hs_eventName;
    baby.hs_eventPhone = payload.hs_eventPhone;
    baby.hs_eventPhoto = payload.hs_eventPhoto;
    baby.hs_eventPhotoCredit = payload.hs_eventPhotoCredit;
    baby.hs_eventProject = payload.hs_eventProject;
    baby.hs_eventStatus = payload.hs_eventStatus;
    baby.hs_eventTicket = payload.hs_eventTicket;
    baby.hs_eventTwitter = payload.hs_eventTwitter;
    baby.hs_eventType = payload.hs_eventType;
    baby.hs_eventVenueName = payload.hs_eventVenueName;
    baby.hs_eventWebsite = payload.hs_eventWebsite;
    baby.hs_featureEvent = payload.hs_featureEvent;
    baby.hs_orgFaceBook = payload.hs_orgFaceBook;
    baby.hs_orgInstagram = payload.hs_orgInstagram;
    baby.hs_orgLat = payload.hs_orgLat;
    baby.hs_orgLong = payload.hs_orgLong;
    baby.hs_orgName = payload.hs_orgName;
    baby.hs_orgPhone = payload.hs_orgPhone;
    baby.hs_orgPhoto = payload.hs_orgPhoto;
    baby.hs_orgPostal = payload.hs_orgPostal;
    baby.hs_orgTwitter = payload.hs_orgTwitter;
    baby.hs_orgWebsite = payload.hs_orgWebsite;
    baby.hs_priContactEmail = payload.hs_priContactEmail;
    baby.hs_priContactExtension = payload.hs_priContactExtension;
    baby.hs_priContactName = payload.hs_priContactName;
    baby.hs_priContactPhone = payload.hs_priContactPhone;
    baby.hs_priContactPos = payload.hs_priContactPos;
    baby.hs_tester = payload.hs_tester;

  */
}
function clearBabies(id){
  $.ajax({
    "url": config.httpHost.app[httpHost] + config.api.get + config.default_repo + '/event_baby/ca.toronto.api.dataaccess.odata4.RemoveAll?filter=hs_documentID eq \''+id+'\'',
    "type": "POST",
    "headers": {
      "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
      "Content-Type": "application/json; charset=utf-8;",
      "Cache-Control": "no-cache"
    },
    "dataType": "json"
  }).success(function (data, textStatus, jqXHR) {
    //console.log('babies deleted',data, textStatus, jqXHR)
  });

  /*
  $.ajax({
    "url": config.httpHost.app[httpHost] + config.api.get + config.default_repo + '/event_baby?format=application/json;odata.metadata=none&$select=id,hs_documentID&$filter=hs_documentID eq \''+id+'\'',
    "type": "GET",
    "headers": {
      "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
      "Content-Type": "application/json; charset=utf-8;",
      "Cache-Control": "no-cache"
    },
    "dataType": "json"
  }).success(function (data, textStatus, jqXHR) {
    console.log(data);
    $.each(data,function(i,val){
      $.ajax({
        "url": config.httpHost.app[httpHost] + config.api.get + config.default_repo + '/event_baby(\''+val.id+'\')'+'?$format=application/json;odata.metadata=none',
        "type": "DELETE",
        "headers": {
          "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
          "Content-Type": "application/json; charset=utf-8;",
          "Cache-Control": "no-cache"
        },
        "dataType": "json"
      }).success(function (data, textStatus, jqXHR) {});
    });
  });
  */
}
function loadBabies(id, payload){
  let a1 =   $.ajax({
      "url": config.httpHost.app[httpHost] + config.api.get + config.default_repo + '/event_baby/ca.toronto.api.dataaccess.odata4.RemoveAll?filter=hs_documentID eq \''+id+'\'',
      "type": "POST",
      "headers": {
        "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
        "Content-Type": "application/json; charset=utf-8;",
        "Cache-Control": "no-cache"
      },
      "dataType": "json"
    }),
    a2 = a1.always(function(data){
      // $.each(payload, function(i,val){
      $.ajax({
        "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + '/event_baby',
        "type": "POST",
        "data":JSON.stringify(payload),
        // "data": JSON.stringify(val),
        "headers": {
          "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
          "Content-Type": "application/json; charset=utf-8;",
          "Cache-Control": "no-cache"
        },
        "dataType": "json"
      }).success(function (data, textStatus, jqXHR) {
        generateBabiesFile(false);
        //});
      });
    });
  a2.done(function(data){
    //console.log('Done loading Babies')
  });
}
function generateBabiesFile(showDone){
  let filter  = "&$filter=hs_eventStatus eq 'Approved' and startDate ge " + moment().startOf('date').format();
  $.ajax({
    "url": config.httpHost.app[httpHost] + config.api.get + config.default_repo + '/event_baby?$format=application/json;odata.metadata=none&unwrap=true&$count=true&$skip=0&$top=1000&$orderby=startDate asc' + filter,
    "type": "GET",
    "headers": {
      "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
      "Content-Type": "application/json; charset=utf-8;",
      "Cache-Control": "no-cache"
    },
    "dataType": "json"
  }).success(function(data, textStatus, jqXHR){

    let payload = {};
    payload.ConfigContent = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    payload.QualifiedName = "cultural_events/edc_hotspots.json";
    payload.ContentType="application/json";

    $.ajax({
      "url": config.httpHost.app[httpHost] +config.api.config+"ConfigSet('"+payload.QualifiedName+"')",
      "type": "PATCH",
      "data":JSON.stringify(payload),
      "headers": {
        "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
        "Content-Type": "application/json; charset=utf-8;",
        "Cache-Control": "no-cache"
      },
      "dataType": "json"
    }).success(function(data, textStatus, jqXHR){
      if(showDone && showDone == true){
        bootbox.alert("List data published.")
      }
      console.log(data, textStatus, jqXHR);
    });

  });
}
function generateBabiesCollection(){
  $.getJSON("/c3api_data/v2/DataAccess.svc/cultural_events/hot_spot?$format=application/json;odata.metadata=none&$skip=0&$top=1000&$filter=hs_eventStatus eq 'Approved'&unwrap=true", function(data){
    $.each(data, function(i,payload){
      if(payload.hs_eventStatus==="Approved"){
        loadBabies(payload.id,processEvent(payload));
      }else if(payload.id){
        clearBabies(payload.id)
      }
    })
  });
}

function printPDF2(headerTextLeft , headerTextRight , footerTextLeft, watermark , fileName ,data){

  let content = [];

  $(".panel-info").each(function(i){

    let this_section = {
      style: 'wo_table',
      table: {
        widths: [ '*', '*'],
        body: []
      },
      layout: 'lightHorizontalLines',
      headerRows: 1
    };
    let this_row = [];
    this_row.push([{text:$(this).find('.panel-heading').text(), colSpan:2, alignment: 'left', style: 'tableHeader'},{}])
    this_section.table.body.push([{text:$(this).find('.panel-heading').text(), colSpan:2, alignment: 'left', style: 'tableHeader'},{}]);
    $(this).find('.panel-body .row').each(function(index){

      $(this).find('.form-group:visible').not('.upload').each(function(index){
        $(this).find('.optional').empty();
        let label = $(this).find('.control-label, .staticlabel').not('.upload').text();
        let value = $(this).find('.form-control').val();
        if(value){}else{
          value = $(this).attr('id') ? data[$(this).attr('id').replace("Element","")]:"";
        }
        if(label){
          let this_row = [label,value];
          this_section.table.body.push(this_row);
        }
      });

      $(this).find('.dropzone:visible').each(function(index){
        $.each(data[$(this).attr("id")], function(i,val){
          let row_title = i===0?"Uploaded Files":"";
          let row_value =[val.name]

          val.credit ? row_value.push("Credit: " + val.credit) : "";
          val.description ? row_value.push("Desc: " + val.description) : "";
          let this_row = [row_title, row_value];
          this_section.table.body.push(this_row);
        });
      });

    });
    content.push(this_section)
  });

  pdfMake.createPdf({
    watermark: {text:watermark, opacity: 0.05, bold:false},
    header: {
      margin: 10,
      columns: [
        {text: headerTextLeft },
        { alignment: 'right',text: headerTextRight}
      ]
    },
    footer: function(page, pages) {
      return {
        columns: [
          footerTextLeft,
          {
            alignment: 'right',
            text: [
              { text: page.toString(), italics: true },
              ' of ',
              { text: pages.toString(), italics: true }
            ]
          }
        ],
        margin: [10, 0]
      };
    },
    pageOrientation: 'portrait',
    content:[content],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 5]
      },
      wo_table: {
        fontSize: 10,
        margin: [0, 5, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: 'black'
      }
    }
  }).download(fileName)


}
jQuery.fn.dataTable.render.ellipsis = function ( cutoff, wordbreak, escapeHtml ) {
  var esc = function ( t ) {
    return t
      .replace( /&/g, '&amp;' )
      .replace( /</g, '&lt;' )
      .replace( />/g, '&gt;' )
      .replace( /"/g, '&quot;' );
  };

  return function ( d, type, row ) {
    // Order, search and type get the original data
    if ( type !== 'display' ) {
      return d;
    }

    if ( typeof d !== 'number' && typeof d !== 'string' ) {
      return d;
    }

    d = d.toString(); // cast numbers

    if ( d.length <= cutoff ) {
      return d;
    }

    var shortened = d.substr(0, cutoff-1);

    // Find the last white space character in the string
    if ( wordbreak ) {
      shortened = shortened.replace(/\s([^\s]*)$/, '');
    }

    // Protect against uncontrolled HTML input
    if ( escapeHtml ) {
      shortened = esc( shortened );
    }

    return '<span class="ellipsis" title="'+esc(d)+'">'+shortened+'&#8230;</span>';
  };
};
