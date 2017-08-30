/* eslint-disable no-unused-vars */
/**
 * Created by gperry2 on 03/14/2017.
 */
const base = "https://dom01d.toronto.ca/intra/edc/TCHotspot.nsf/";

function loadDominoData(form, process){
  let url = base;
  let view = "";
  switch(form){
    case 'hot_spot':
      view = "hotSpotJSON.xsp";
      break;
    case 'hot_eats':
      view = "hotEatsJSON.xsp";
      break;
    default:
      view = "";
      break;
  }
  $.getJSON(url + view , function(data) {
    $.each(data, function (i, val) {
     if(i>=10){return false}
      let postdata = JSON.stringify(process ? process(val) : val);


      $.ajax({
        url: config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/" + form + '?sid=' + getCookie(config.default_repo + '.sid'),
        type: 'POST',
        data: postdata,
        async: false,
        headers: {
          'Content-Type': 'application/json; charset=utf-8;',
          'Cache-Control': 'no-cache'
        },
        dataType: 'json'
      }).success(function (data) {
        console.log('created', data.id)
      }).error(function () {
        console.log('failed')
      })


      //$.post(config.httpHost.app[httpHost]+ config.api.post + config.default_repo + "/"+config.repo[form], JSON.stringify(val))
    });

  })

}
function deleteData(form){
  let url = config.httpHost.app[httpHost]+ config.api.post + config.default_repo + "/"+form +'?sid=' + getCookie('csu.sid');


  $.getJSON(url, function(data){
    console.log(data)
    $.each(data.value, function(i,val){
      console.log(i, val.id)
      $.ajax({
        url: config.httpHost.app[httpHost] + config.api.delete + config.default_repo +"/"+form+ "('"+ val.id+ "')"+'?sid=' + getCookie('csu.sid'),
        type: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf-8;',
          'Cache-Control': 'no-cache'
        },
        dataType: 'json'
      }).done(function() {
        console.log('entity deleted', form)
      }).fail(function() {
        console.log('entity delete failed', form)
      }).always(function() {

      });
    })
  })


}
function deleteEntity(form){
  let url = config.httpHost.app[httpHost]+ config.api.post + config.default_repo +'/RemoveEntitySet?sid=' + getCookie('csu.sid');
  let val = {};
  val.EntitySetName= form;
  let postdata = JSON.stringify(val);
  $.ajax({
    url: url,
    type: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
    },
    data:postdata,
    dataType: 'json'
  }).done(function() {
    console.log('entity deleted', form)
  }).fail(function() {
    console.log('entity delete failed', form)
  }).always(function() {

  });


}
function loadDominoDatawUploads(form, process, process_uploads){
  let url = base;
  let view = "";
  switch(form){
    case 'hot_spot':
      view = "hotSpotJSON.xsp";
      break;
    case 'hot_eats':
      view = "hotEatsJSON.xsp";
      break;
    default:
      view = "";
      break;
  }

$.ajax( url+ view, { dataType: "json" } ).then(function( data ) {
      $.each(data, function (i, doc) {
        if(i<4){
          doc.uploadedFiles= [];
          var promise =  processDoc(i,doc);
          promise.done(function(){
            setTimeout(function(){
                let postdata = JSON.stringify(doc);
                let keepFiles = "";

                $.each(doc.uploadedFiles, function (i, val) {
                  keepFiles += val.bin_id + ","
                  console.log(i,val,keepFiles )
                });

                  console.log(i,'processDoc done', doc.uploadedFiles,keepFiles ,doc.uploadedFiles.length);

                $.ajax({
                  url:  "https://was-inter-sit.toronto.ca/cc_sr_v1/submit/hot_spot_public?keepFiles=" + keepFiles,
                  //url: config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/" + form + '?sid=' + getCookie(config.default_repo + '.sid'),
                  type: 'POST',
                  data: postdata,
                  async: false,
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8;',
                    'Cache-Control': 'no-cache'
                  },
                  dataType: 'json'
                }).success(function (data) {
                  if (data.EventMessageResponse.Response.StatusCode == "201") { console.log('created', data)}else{console.log(data)}

                }).error(function () {
                  console.log('failed')
                })
            }, 3000);

          });
        }
      })
    }, function(){console.log('fail');}).done(function( data ) {
    console.log("chained.done", data);
  });



}
function processDoc(i, doc){
  var deferred = $.Deferred();

  $.each(doc.attachmentNames, function(i, val){
    /*
    console.log(doc.unid, val);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          console.log('processDoc: ',doc.unid);
          let pi= postImage(val, doc, this.response, i);
          console.log('pi:', pi);
        } else {
          console.log('we have an issue' , doc)
        }
      }
    };
    xhr.open('GET', base + doc.unid + "/$File/"+doc.attachmentNames[i] );    //3rd of false means async.. saves us a little trouble. but ivalid for blobs..so
    xhr.responseType = 'blob';
    xhr.send();
*/
    //console.log('processDoc start',doc.unid, val);
    var promise =  getImage(doc, val);
    promise.done(console.log('getImageDone'));
  });

  deferred.resolve();
  return deferred.promise();
}
function getImage(doc, val) {
  var deferred = $.Deferred();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {

          var promise = postImage(val, doc, this.response);
          promise.done(console.log('postImage: ',doc.unid));
          deferred.resolve();
        } else {
          console.log('we have an issue' , doc)
        }
      }
    };
    xhr.open('GET', base + doc.unid + "/$File/"+val );
    xhr.responseType = 'blob';
    xhr.send();


  return deferred.promise();
}
function postImage(idx, doc, blob, counterImage) {
  var deferred = $.Deferred();
  const uploadurl = config.httpHost.app[httpHost] +  config.api.upload +config.upload_repo + '/' + config.upload_repo;
  //console.log(idx, doc, blob, counterImage, uploadurl)
  let form = new FormData();
  form.append('file', blob, idx);
  //let ret = uploadAttachment(form);
  //deferred.resolve(uploadAttachment(form).done(function(data){return data;}).fail(function(data){console.log('fail',data);}));
  //uploadAttachment(form).done(function(data){console.log('success',data);}).fail(function(data){console.log('fail',data);})

  $.ajax({
    type: "POST",
    url: uploadurl,
    dataType: 'json',
    processData: false,
    contentType: false,
    async: false,
    data: form
  }).success(function (response) {
    let json = {};
    json.name = idx;
    json.type = blob.type;
    json.size = blob.size;
    json.bin_id = response.BIN_ID[0];
    doc.uploadedFiles.push(json);
    deferred.resolve(response);
    return deferred.promise();
  }).error(function (response) {
console.log(error);
  });
  return deferred.promise();
}
function uploadAttachment(formData) {

  var deferred = $.Deferred();
  var strURL = config.httpHost.app[httpHost] +  config.api.upload +config.upload_repo + '/' + config.upload_repo;

  $.ajax({
    type: "POST",
    url: strURL,
    dataType: 'json',
    processData: false,
    contentType: false,
    data: formData
  }).success(function (response) {
    deferred.resolve(response);
  }).error(function (response) {
    deferred.reject({ 'type': "Upload Failed", error: "A common component API service has failed. Please try again at another time." });
  });

  return deferred;

}

/*
function CC_API(){
CC_API.prototype.uploadAttachment = function (eventType, uploadDesc, formData) {
  NProgress.start();
  var deferred = $.Deferred();
  var strURL = this.ATTACHMENT_UPLOAD_URL.replace('<eventType>', eventType).replace('<uploadDesc>', uploadDesc);

  $.ajax({
    type: "POST",
    url: strURL,
    dataType: 'json',
    processData: false,
    contentType: false,
    data: formData
  }).success(function (response) {
    deferred.resolve(response);
  }).error(function (response) {
    deferred.reject({ 'type': "Upload Failed", error: "A common component API service has failed. Please try again at another time." });
  });

  return deferred;

};
}
*/
