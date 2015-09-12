var fs = require('fs');
var path = require('path');
var extend = require('extend');
var JSZip  = require('jszip');

var nodelistDefaults = {
   zip: false
};

var nodelist = function(nodelistPath, nodelistOptions){
   if (!(this instanceof nodelist)){
      return new nodelist(nodelistPath, nodelistOptions);
   }
   var options = extend({}, nodelistDefaults, nodelistOptions);

   if( nodelistPath.slice(-1) === '*' ){ // wildcard mode
      var dirname = path.dirname(nodelistPath);
      var basename = path.basename(nodelistPath).slice(0, -1);

      var dir = fs.readdirSync(dirname).map(function(dirEntry){
         if( dirEntry.indexOf(basename) !== 0 ) return null;

         var fullPath = path.join(dirname, dirEntry);
         var stats = fs.statSync(fullPath);
         if(!( stats.isFile() )) return null;

         return fullPath;
      }).filter(function(dirEntry){
         return dirEntry !== null;
      }).sort(function(fullPath1, fullPath2){
         var stat1 = fs.statSync(fullPath1);
         var stat2 = fs.statSync(fullPath2);
         return stat1.ctime.getTime() - stat2.ctime.getTime();
      }).reverse();

      if( dir.length < 1 ) throw new Error(this.errors.NO_MATCHING_FILES);
      nodelistPath = dir[0];
   }

   var nodelistString;
   if( options.zip ){
      var nodelistBuffer = fs.readFileSync(nodelistPath);
      var zip = JSZip(nodelistBuffer, { checkCRC32: true });

      var zipDir = zip.file(/^[^/]+$/);
      if( zipDir.length < 1 ){
         throw new Error(this.errors.NO_FILES_IN_ZIP);
      } else if( zipDir.length > 1 ){
         throw new Error(this.errors.MANY_FILES_IN_ZIP);
      }

      nodelistString = zipDir[0].asBinary();
   } else {
      nodelistString = fs.readFileSync(nodelistPath, {
         encoding: 'utf8'
      });
   }

   if( nodelistString.slice(-1) === '\x1A' ){ // EOF
      nodelistString = nodelistString.slice(0, -1);
   }
   var nodelistLines = nodelistString.split( /\x0d?\x0a/ );
   nodelistString = null;

   this.nodelistLines = nodelistLines.filter(function(line){
      // drop empty lines, drop comment lines
      return line.length > 0 && line.indexOf(';') !== 0;
   });
};

nodelist.prototype.getLineForAddr = function(address){
   address = '' + address;

   var matches = /^(\d+):(\d+)\/(\d+)$/.exec(address);
   if( matches === null ) return null;

   var reZone = RegExp('^Zone,' + matches[1] + ',');
   var idxZone = this.nodelistLines.findIndex(function(line){
      // `this` contains regex
      return this.test(line);
   }, reZone);
   if( idxZone < 0 ) return null;

   if( matches[3] === '0' && matches[1] === matches[2] ){
      // zone mode
      return this.nodelistLines[idxZone];
   }

   var idxZoneNext = this.nodelistLines.findIndex(function(line, idx){
      // `this.prevIDX` contains index of the previous zone
      if( idx <= this.prevIDX ) return false;
      // `this.strZone` contains starting string
      return line.indexOf(this.strZone) === 0;
   }, {
      prevIDX: idxZone,
      strZone: 'Zone,'
   });
   if( idxZoneNext < 0 ) idxZoneNext = this.nodelistLines.length;

   var reRegNet = RegExp('^(?:Region|Host),' + matches[2] + ',');
   var idxRegNet = this.nodelistLines.findIndex(function(line, idx){
      // `this.prevIDX` contains index of the previous zone
      if( idx <= this.prevIDX ) return false;
      // `this.nextIDX` contains index of the next zone
      if( idx >= this.nextIDX ) return false;
      // `this.reRegNet` contains regex
      return this.reRegNet.test(line);
   }, {
      prevIDX: idxZone,
      nextIDX: idxZoneNext,
      reRegNet: reRegNet
   });
   if( idxRegNet < 0 ) return null;

   if( matches[3] === '0' ){
      // region or net mode
      return this.nodelistLines[idxRegNet];
   }

   var idxRegNetNext = this.nodelistLines.findIndex(function(line, idx){
      // `this.prevIDX` contains index of the previous region or net
      if( idx <= this.prevIDX ) return false;
      // `this.nextIDX` contains index of the next zone
      if( idx >= this.nextIDX ) return false;
      // `this.reRegNet` contains regex
      return this.reRegNet.test(line);
   }, {
      prevIDX: idxRegNet,
      nextIDX: idxZoneNext,
      reRegNet: /^(?:Region|Host),/
   });
   if( idxRegNetNext < 0 ) idxRegNetNext = idxZoneNext;

   var reNode = RegExp('^(?:Pvt|Hold|Down|Hub)?,' + matches[3] + ',');
   var idxNode = this.nodelistLines.findIndex(function(line, idx){
      // `this.prevIDX` contains index of the previous region or net
      if( idx <= this.prevIDX ) return false;
      // `this.nextIDX` contains index of the next region or net
      if( idx >= this.nextIDX ) return false;
      // `this.reNode` contains regex
      return this.reNode.test(line);
   }, {
      prevIDX: idxRegNet,
      nextIDX: idxRegNetNext,
      reNode:  reNode
   });
   if( idxNode < 0 ) return null;

   return this.nodelistLines[idxNode];
};

nodelist.prototype.getFieldsForAddr = function(address){
   var nodelistLine = this.getLineForAddr(address);
   if( nodelistLine === null ) return null;

   var lineFields = nodelistLine.split(',');
   nodelistLine = void 0;
   if( lineFields.length < 7 ) return null;

   var fields = {};
   fields.keyword     = lineFields.shift();
   fields.nodeNumber  = lineFields.shift();
   fields.nodeName    = lineFields.shift().replace(/_/g, ' ');
   fields.location    = lineFields.shift().replace(/_/g, ' ');
   fields.sysopName   = lineFields.shift().replace(/_/g, ' ');
   fields.phoneNumber = lineFields.shift();
   fields.speed       = lineFields.shift();
   fields.normalFlags = [];
   fields.userFlags   = [];

   var fillingNormalFlags = true;
   lineFields.forEach(function(nextField){
      if( fillingNormalFlags && nextField.indexOf('U') === 0 ){
         fillingNormalFlags = false;
         if( nextField.length <= 1 ) return;
         nextField = nextField.slice(1);
      }
      if( fillingNormalFlags ){
         fields.normalFlags.push(nextField);
         return;
      }
      fields.userFlags.push(nextField);
   });

   return fields;
};

nodelist.prototype.errors = {
   NO_FILES_IN_ZIP:  "The nodelist's ZIP archive must contain a file!",
   MANY_FILES_IN_ZIP:"The nodelist's ZIP archive must contain only one file!",
   UNKNOWN_ZIP_COMPRESSION: "Unknown ZIP compression type!",
   NO_MATCHING_FILES: "No files matching the given wildcard!"
};

module.exports = nodelist;