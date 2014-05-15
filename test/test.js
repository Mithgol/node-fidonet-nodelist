/* global describe, it */
var assert = require('assert');
var path = require('path');

var testLine = ',88,FGHI_Global_Headlight_Ignited,Gelendzhik,' +
               'Sergey_Sokoloff,-Unpublished-,300,IBN:1978,' +
               'INA:Fidonet.Mithgol.Ru,TSU';
var testLine2 = ',88,FGHI_Global_Headlight_Ignited,Gelendzhik,' +
                'Sergey_Sokoloff,00-00-000000,300,IBN:1978,' +
                'INA:Fidonet.Mithgol.Ru,U,TSU';

describe('Fidonet nodelist reader', function(){
   var nodelist = require('../')( path.join(__dirname, 'nodelist.txt') );
   var idx;

   it('the "FGHI Global Headlight Ignited" node can be found', function(){
      idx = nodelist.nodelistLines.indexOf(testLine);
      assert.notEqual(idx, -1);
   });

   it("almost the same node's line can be found in another net", function(){
      var idx2 = nodelist.nodelistLines.indexOf(testLine2, idx+1);
      assert.notEqual(idx2, -1);
   });
});