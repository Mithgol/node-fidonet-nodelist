require('array.prototype.findindex');
var fs = require('fs');

var nodelist = function(nodelistPath){
   if (!(this instanceof nodelist)) return new nodelist(nodelistPath);

   var nodelistString = fs.readFileSync(nodelistPath, {
      encoding: 'utf8'
   });
   if( nodelistString.slice(-1) === '\x1A' ){ // EOF
      nodelistString = nodelistString.slice(0, -1);
   }
   var nodelistLines = nodelistString.split( /\x0d?\x0a/ );
   nodelistString = null;

   this.nodelistLines = nodelistLines.filter(function(line){
      return line.length > 0 && line.indexOf(';') !== 0;
   });
};

nodelist.prototype.getLineForNode = function(node){
   node = '' + node;
   if(! /^\d+:\d+\/\d+$/.test(node) ) return null;
   var matches, reZone;

   matches = /^(\d+):\1\/0$/.exec(node);
   if( matches !== null ){ // zone
      reZone = RegExp('^Zone,' + matches[1] + ',');
      var idx = this.nodelistLines.findIndex(function(line){
         // `this` contains regex
         return this.test(line);
      }, reZone);
      if( idx < 0 ){
         return null;
      } else return this.nodelistLines[idx];
   }

   matches = /^(\d+):(\d+)\/0$/.exec(node);
   if( matches !== null ){ // region or net
      reZone = RegExp('^Zone,' + matches[1] + ',');
      var idxZone = this.nodelistLines.findIndex(function(line){
         // `this` contains regex
         return this.test(line);
      }, reZone);
      if( idxZone < 0 ) return null;

      var idxZoneNext = this.nodelistLines.findIndex(function(line, idx){
         // `this.prevIDX` contains index of the previous zone
         if( idx <= this.prevIDX ) return false;
         // `this.reZone` contains regex
         return this.reZone.test(line);
      }, {
         prevIDX: idxZone,
         reZone: /^Zone,/
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
      if( idxRegNet < 0 ){
         return null;
      } else return this.nodelistLines[idxRegNet];
   }
};

module.exports = nodelist;