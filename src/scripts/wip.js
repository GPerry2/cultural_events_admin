
function processEvent(payload){
  //console.log('processEvent - payload', payload);
  let eStartDate = moment(payload.hs_eventStartDate), eEndDate = moment(payload.hs_eventEndDate);
  var result = [];
  let locations = [];
  if(payload && payload.id){
    $(payload.repeatControl).each(function(i, repeat){

      if(repeat.event_frequency==="weekly"){

        var current = eStartDate.clone();

        while (current.day(7 + parseInt(repeat.dayOfWeek)).isBefore(eEndDate)) {
          let baby  = {};
          console.log(current.format("YYYY-MM-DD") +  " " + repeat.weeklyStartTime );
          baby.hs_eventStartDate = payload.hs_eventEndDate;
          baby.hs_eventEndDate = payload.hs_eventEndDate;
          baby.startDate = moment(current.format("YYYY-MM-DD") +  " " + repeat.weeklyStartTime, "YYYY-MM-DD hh:mm a" ).format();
          baby.endDate = moment(current.format("YYYY-MM-DD") +  " " + repeat.weeklyEndTime, "YYYY-MM-DD hh:mm a" ).format();
          baby = makeBaby(baby, payload, repeat);
          result.push(baby);
        }
        console.log(result)
      }
      else{

      }
    });
  }
  else{}


}
function makeBaby(baby, payload, repeat){

  baby.hs_eventAccessibility = payload.hs_eventAccessibility;
  baby.hs_eventDescription = payload.hs_eventDescription;
  baby.hs_eventDescriptionShort = payload.hs_eventDescriptionShort;
  baby.hs_eventFaceBook = payload.hs_orgFacebook;
  baby.hs_eventFamily = payload.hs_eventFamily;
  baby.hs_eventFree = payload.hs_eventFree;
  baby.hs_eventInstagram = payload.hs_orgInstagram;
  baby.hs_eventName = payload.hs_eventName;
  baby.hs_eventPhone = payload.hs_eventPhone;
  baby.hs_eventPhoto = payload.hs_eventPhoto;
  baby.hs_eventPhotoCredit = payload.hs_eventPhotoCredit;
  //baby.hs_eventTicket = payload.hs_eventTicket;
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
  baby.hs_orgName = payload.hs_orgName;
  baby.hs_orgPhone = payload.hs_priContactPhone;
  //baby.hs_orgPhoto = payload.hs_orgPhoto;
  //baby.hs_orgPostal = payload.hs_orgPostal;
  baby.hs_orgTwitter = payload.hs_orgTwitter;
  baby.hs_orgWebsite = payload.hs_orgWebsite;
  baby.hs_tester = payload.hs_eventAccessibility;
  baby.locations = [
    {
      "startDate":baby.startDate,
      "endDate":baby.endDate,
      "location":repeat.venue_verifiedAddress,
      "latitude":repeat.venue_latitude,
      "longitude":repeat.venue_longitude,
      "datetext":repeat.event_frequency,
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
function clearBabies(id){}
function loadBabies(ret){}
