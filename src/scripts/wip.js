function appInitialize() {
  $("#user_auth_title").html("<span style=\"margin-left:4px;\">" + getCookie(config.default_repo + '.cot_uname') + "</span>");

}

/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
function getSubmissionSections(form_id, data) {
  let section, model, registerFormEvents;
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
                {
                  "id": "hs_eventFree",
                  "bindTo": "hs_eventFree",
                  "title": "Is your event Free?",
                  "type": "radio",
                  "choices": [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
                  "orientation": "horizontal",
                  "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventDescriptionShort",
                  "bindTo": "hs_eventDescriptionShort",
                  "title": "Event Short Description",
                  "type": "textarea",
                  "prehelptext": "<span id='eventDescriptionShortMaxLength' class='pull-right'></span>",
                  "htmlAttr": {maxlength: config["short_text_max"]},
                  "required": true
                },
                {
                  "id": "hs_eventDescription",
                  "bindTo": "hs_eventDescription",
                  "title": "Event Long Description",
                  "type": "textarea",
                  "prehelptext": "<span id='eventDescriptionLongMaxLength' class='pull-right'></span>",
                  "htmlAttr": {maxlength: config["long_text_max"]},
                  "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "docsIntro",
                  "title": "File Attachments",
                  "type": "html",
                  "html": `<section id="attachment">
                    <h4>Photo</h4>
                        <div class="dropzone" id="uploadedFiles"></div>
                    </section>
                    <section id="uploadedFiles_display"></section>`
                }
              ]
            },

            {
              "fields": [
                {
                  "id": "hs_eventPhotoCredit",
                  "bindTo": "hs_eventPhotoCredit",
                  "title": "Photo Credit",
                  "type": "text",
                  "required": false
                },
                {
                  "id": "hs_eventWebsite",
                  "bindTo": "hs_eventWebsite",
                  "title": "Event Website or Facebook Page",
                  "validators": {"uri": {"message": "The website address is not valid", "allowEmptyProtocol": true}}
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventPhone",
                  "bindTo": "hs_eventPhone",
                  "title": "Event Contact Phone",
                  "type": "text",
                  "required": false,
                  "validationtype": "Phone"
                },
                {
                  "id": "hs_eventPhoneExtension",
                  "bindTo": "hs_eventPhoneExtension",
                  "title": "Extension",
                  "type": "text",
                  "required": false
                },
                {
                  "id": "hs_eventType",
                  "bindTo": "hs_eventType",
                  "title": "Event Type",
                  "type": "multiselect",
                  "multiple": true,
                  "required": true,
                  "choices": config["eventTypeChoices"],
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
                  "choices": config["eventFeaturesChoices"],
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
                  "id": "hs_venueName1",
                  "bindTo": "hs_venueName1",
                  "type": "text",
                  "title": "Venue",
                  "required": true
                },
                {
                  "id": "hs_venueAddress1",
                  "bindTo": "hs_venueAddress1",
                  "type": "text",
                  "title": "Address or Intersection",
                  "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventDateTime1",
                  "bindTo": "hs_eventDateTime1",
                  "type": "text",
                  "title": "Date and Time Details",
                  "infohelp": config["venueDateTimeDetailsHelp"],
                  "required": true
                },
                {
                  "id": "hs_dateEventStart1",
                  "bindTo": "hs_dateEventStart1",
                  "type": "datetimepicker",
                  "title": "Start Date",
                  "required": true
                },
                {
                  "id": "hs_dateEventEnd1",
                  "bindTo": "hs_dateEventEnd1",
                  "type": "datetimepicker",
                  "title": "End Date",
                  "required": true
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_verifiedAddress_1",
                  "bindTo": "hs_verifiedAddress_1",
                  "type": "text",
                  "title": "Verified Address"
                },
                {
                  "id": "hs_venueLat_1",
                  "bindTo": "hs_venueLat_1",
                  "type": "text",
                  "title": "Lat"
                },
                {
                  "id": "hs_venueLong_1",
                  "bindTo": "hs_venueLong_1",
                  "type": "text",
                  "title": "Long"
                },
                {
                  "id": "hs_ward_1",
                  "bindTo": "hs_ward_1",
                  "type": "text",
                  "title": "Ward"
                },

                {
                  "id": "venue_location",
                  "type": "html",
                  "html": `<div id="vLookup_1" data-id="1" data-prefix="hs" class="btn btn-success vLookup">Location Lookup</div><input type="hidden" name="hs_geoID_1" id="hs_geoID_1" value=""/><input type="hidden" name="hs_matchType_1" id="hs_matchType_1" value=""/>`
                }
              ]
            }
          ]
        },
        {
          "id": "venueInfoSection2",
          "title": "Second Venue Information (Optional)",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "hs_venueName2",
                  "bindTo": "hs_venueName2",
                  "type": "text",
                  "title": "Venue",
                  "required": false
                },
                {
                  "id": "hs_venueAddress2",
                  "bindTo": "hs_venueAddress2",
                  "type": "text",
                  "title": "Address or Intersection",
                  "required": false
                }

              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventDateTime2",
                  "bindTo": "hs_eventDateTime2",
                  "type": "text",
                  "title": "Date and Time Details",
                  infohelp: config["venueDateTimeDetailsHelp"],
                  "required": false
                },
                {
                  "id": "hs_dateEventStart2",
                  "bindTo": "hs_dateEventStart2",
                  "type": "datetimepicker",
                  "title": "Start Date",
                  "required": false
                },
                {
                  "id": "hs_dateEventEnd2",
                  "bindTo": "hs_dateEventEnd2",
                  "type": "datetimepicker",
                  "title": "End Date",
                  "required": false
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_verifiedAddress_2",
                  "bindTo": "hs_verifiedAddress_2",
                  "type": "text",
                  "title": "Verified Address"
                },
                {
                  "id": "hs_venueLat_2",
                  "bindTo": "hs_venueLat_2",
                  "type": "text",
                  "title": "Lat"
                },
                {
                  "id": "hs_venueLong_2",
                  "bindTo": "hs_venueLong_2",
                  "type": "text",
                  "title": "Long"
                },
                {
                  "id": "hs_ward_2",
                  "bindTo": "hs_ward_2",
                  "type": "text",
                  "title": "Ward"
                },

                {
                  "id": "venue_location",
                  "type": "html",
                  "html": `<div id="vLookup_2" data-id="2" data-prefix="hs" class="btn btn-success vLookup">Location Lookup</div><input type="hidden" name="hs_geoID_2" id="hs_geoID_2" value=""/><input type="hidden" name="hs_matchType_2" id="hs_matchType_2" value=""/>`
                }
              ]
            }
          ]
        },
        {
          "id": "venueInfoSection3",
          "title": "Third Venue Information (Optional)",
          "className": "panel-info",
          "rows": [
            {
              "fields": [
                {
                  "id": "hs_venueName3",
                  "bindTo": "hs_venueName3",
                  "type": "text",
                  "title": "Venue",
                  "required": false
                },
                {
                  "id": "hs_venueAddress3",
                  "bindTo": "hs_venueAddress3",
                  "type": "text",
                  "title": "Address or Intersection",
                  "required": false
                }
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_eventDateTime3",
                  "bindTo": "hs_eventDateTime3",
                  "type": "text",
                  "title": "Date and Time Details",
                  infohelp: config["venueDateTimeDetailsHelp"],
                  "required": false
                },
                {
                  "id": "hs_dateEventStart3",
                  "bindTo": "hs_dateEventStart3",
                  "type": "datetimepicker",
                  "title": "Start Date",
                  "required": false
                },
                {
                  "id": "hs_dateEventEnd3",
                  "bindTo": "hs_dateEventEnd3",
                  "type": "datetimepicker",
                  "title": "End Date",
                  "required": false
                },
              ]
            },
            {
              "fields": [
                {
                  "id": "hs_verifiedAddress_3",
                  "bindTo": "hs_verifiedAddress_3",
                  "type": "text",
                  "title": "Verified Address"
                },
                {
                  "id": "hs_venueLat_3",
                  "bindTo": "hs_venueLat_3",
                  "type": "text",
                  "title": "Lat"
                },
                {
                  "bindTo": "hs_venueLong_3",
                  "id": "hs_venueLong_3",
                  "type": "text",
                  "title": "Long"
                },
                {
                  "id": "hs_ward_3",
                  "bindTo": "hs_ward_3",
                  "type": "text",
                  "title": "Ward"
                },

                {
                  "id": "venue_location",
                  "type": "html",
                  "html": `<div id="vLookup_3" data-id="3" data-prefix="hs" class="btn btn-success vLookup">Location Lookup</div><input type="hidden" name="hs_geoID_3" id="hs_geoID_3" value=""/><input type="hidden" name="hs_matchType_3" id="hs_matchType_3" value=""/>`
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
                  "htmlAttr": {maxlength: config["long_text_max"]},
                  "prehelptext": config["orgDescriptionHelp"] + "<span id='orgDescriptionMaxLength' class='pull-right'></span>"
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
        "hs_eventFeatured": "",
        "hs_eventProject": "",
        "hs_eventStatus": "",
        "hs_eventName": "",
        "hs_eventFree": "",
        "hs_eventDescriptionShort": "",
        "hs_eventDescription": "",
        "hs_eventPhotoCredit": "",
        "hs_eventWebsite": "",
        "hs_eventPhone": "",
        "hs_eventPhoneExtension": "",
        "hs_eventType": [""],
        "hs_eventAccessibility": "",
        "hs_eventFamily": "",
        "hs_venueName1": "",
        "hs_venueAddress1": "",
        "hs_eventDateTime1": "",
        "hs_dateEventStart1": "",
        "hs_dateEventEnd1": "",
        "hs_verifiedAddress_1": "",
        "hs_venueLat_1": "",
        "hs_venueLong_1": "",
        "hs_ward_1": "",
        "hs_ward_2": "",
        "hs_ward_3": "",
        "hs_venueName2": "",
        "hs_venueAddress2": "",
        "hs_eventDateTime2": "",
        "hs_dateEventStart2": "",
        "hs_dateEventEnd2": "",
        "hs_verifiedAddress_2": "",
        "hs_venueLat_2": "",
        "hs_venueLong_2": "",
        "hs_venueName3": "",
        "hs_venueAddress3": "",
        "hs_eventDateTime3": "",
        "hs_dateEventStart3": "",
        "hs_dateEventEnd3": "",
        "hs_verifiedAddress_3": "",
        "hs_venueLat_3": "",
        "hs_venueLong_3": "",
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
        "SubmissionStatus": "Unapproved",
        "uploadedFiles": []
      });
      registerFormEvents = function () {
        console.log('registerFormEvents');
      };
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
                  "title": "Status",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.eventStatusChoices
                },
                {
                  id: "he_receivied",
                  "title": "Receivied",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": config.yesNoRadio
                },
                {
                  id: "he_awarded",
                  "title": "Awarded",
                  "type": "radio",
                  "required": true,
                  "orientation": "horizontal",
                  "choices": config.yesNoRadio
                },
                {
                  "id": "he_loops",
                  "title": "Loops",
                  "type": "dropdown",
                  "required": true,
                  "choices": config.loops
                }
              ]
            },
            {
              fields: [
                {
                  "id": "he_verifiedAddress",
                  "title": "Verified Address"
                },
                {
                  "id": "he_latitude",
                  "title": "Lat"
                },
                {
                  "id": "he_longitude",
                  "title": "Long"
                },
                {
                  "id": "he_ward",
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
                  "id": "he_services",
                  "bindTo": "he_services",
                  "title": "Services",
                  "required": true,
                  "type": "multiselect",
                  "choices": config.services,
                  "orientation": "horizontal", "multiple": true,
                },
                {
                  "id": "he_typesOfFood",
                  "bindTo": "he_typesOfFood",
                  "title": "Cuisine",
                  "required": true,
                  "type": "multiselect",
                  "choices": config.cuisine,
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
                  "title": "Description of your business",
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
                  "required": true,
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
                  "id": "giftCertificateInfo",
                  "title": "",
                  "type": "html",
                  "html": config.gift_certificateInfo
                }
              ]
            },
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
        "he_eventStatus": "Pending"
      });
      registerFormEvents = function () {
        console.log('registerFormEvents');
      };
      break;

  }
  return [section, model, registerFormEvents];
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
        {"data": "hs_eventName", "title": "Event Name", "filter": false, "sortOrder": "asc"},
        {
          "data": "hs_eventStatus",
          "title": 'Event Status',
          "filter": true,
          "sortOrder": "asc",
          "restrict": filter["hs_eventStatus"],
          "filterChoices": config.eventStatusFilter
        },
        {
          "data": "hs_eventProject",
          "title": "Project",
          "filter": true,
          "sortOrder": "asc",
          "filterChoices": config.eventProjectFilter
        },
        {"data": "hs_ward_1", "title": "Ward", "filter": true, "sortOrder": "asc", "filterChoices": config.wards},
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
          "orderable": true,
          "sortOrder": "asc",
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
            console.log('a', td, 'b', cellData, 'c', rowData)
          }
        },
        {"data": "he_restaurantName", "title": "Restaurant Name", "filter": false, "sortOrder": "asc"},
        {
          "data": "he_eventStatus",
          "title": 'Event Status',
          "filter": true,
          "sortOrder": "asc",
          "restrict": filter["he_eventStatus"],
          "filterChoices": config.eventStatusFilter
        }
      ];
      view = "hot_eats";
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
    hasher.setHash($(this).attr('data-id') + '/new?ts=' + new Date().getTime());
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

  $("#maincontent").off('click', '.vLookup').on('click', '.vLookup', function () {
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

  // not implemented see CSU application for deleteReport method
  $("#maincontent").off("click", ".btn-delete").on("click", ".btn-delete", function (e) {
    let fid = hasher.getHashAsArray()[1].substring(0, hasher.getHashAsArray()[1].indexOf('?'));
    let formName = hasher.getHashAsArray()[0]
    bootbox.confirm({
      size: "small",
      message: "Are you sure you want to DELETE entity?",
      callback: function (result) {
        if (result === true) {
          deleteReport(fid, formName);
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
        console.log(data, lookup, 'venue_id:', venue_id, 'prefix:', prefix, 'postfix:', postfix, ' lat:', data["latitude"], '$("#"+prefix+"venueLat"+ postfix)', $("#" + prefix + "venueLat" + postfix))

        $("#" + prefix + "_verifiedAddress" + postfix).val(data["key_Desc"]);
        if (prefix === "hs") {
          $("#" + prefix + "_venueLat" + postfix).val(data["latitude"]);
          $("#" + prefix + "_venueLong" + postfix).val(data["longitude"]);
        } else {
          $("#" + prefix + "_latitude").val(data["latitude"]);
          $("#" + prefix + "_longitude").val(data["longitude"]);
        }

        $("#" + prefix + "_ward" + postfix).val(data["detail"].indexOf("Ward:") > -1 ? data["detail"].substring(data["detail"].indexOf("Ward:") + 6, data["detail"].length) : "");
        $("#" + prefix + "_geoID" + postfix).val(data["geoID"]);
        $("#" + prefix + "_matchType" + postfix).val(data["matchType"]);
        dialog.find(".bootbox-body").html("");
        dialog.modal("hide");
      });
    });
  })
}
