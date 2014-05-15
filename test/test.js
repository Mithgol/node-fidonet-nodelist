/* global describe, it */
var assert = require('assert');
var path = require('path');

var testLine = ',88,FGHI_Global_Headlight_Ignited,Gelendzhik,' +
               'Sergey_Sokoloff,-Unpublished-,300,IBN:1978,' +
               'INA:Fidonet.Mithgol.Ru,TSU';

describe('Fidonet nodelist reader', function(){
   var nodelist = require('../')( path.join(__dirname, 'nodelist.txt') );

   it('contains the "FGHI Global Headlight Ignited" node', function(){
      assert.notEqual(nodelist.nodelistLines.indexOf(testLine), -1);
   });
});