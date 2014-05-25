/* global describe, it */
var assert = require('assert');
var path = require('path');

var testLine = ',88,FGHI_Global_Headlight_Ignited,Gelendzhik,' +
               'Sergey_Sokoloff,-Unpublished-,300,IBN:1978,' +
               'INA:Fidonet.Mithgol.Ru,TSU';
var testLine2 = ',88,FGHI_Global_Headlight_Ignited,Gelendzhik,' +
                'Sergey_Sokoloff,00-00-000000,300,IBN:1978,' +
                'INA:Fidonet.Mithgol.Ru,U,TSU';

var fieldsZone2Reg50Node88 = {
   keyword:     '',
   nodeNumber:  '88',
   nodeName:    'FGHI Global Headlight Ignited',
   location:    'Gelendzhik',
   sysopName:   'Sergey Sokoloff',
   phoneNumber: '-Unpublished-',
   speed:       '300',
   normalFlags: [
      'IBN:1978',
      'INA:Fidonet.Mithgol.Ru',
      'TSU'
   ],
   userFlags: []
};

var lineZone2 = 'Zone,2,Eur_(122),B,Ward_Dossche,32-3-4480880,33600,V34,' +
                'VFC,ICM,XX,IEM,ITX,IBN,TXH';
var lineZone2Reg50 = 'Region,50,Russia,Moscow,Alex_Barinov,-Unpublished-,' +
                     '300,CM,XX,V90S,IBN,INA:fido.hubahuba.su,' +
                     'IRD:binkp.net,U,DO4:binkp.net';
var lineZone2Net5063 = 'Host,5063,Kuban_Net,Krasnodar_Russia,' +
                       'Igor_Grabelnikov,7-861-222-8470,9600,XX,MO,CM,' +
                       'V42B,HST,V32T,V34';

describe('Fidonet nodelist reader', function(){
   var nodelist;
   var nodelistZIP;
   var idx;

   it('the .txt nodelist is read, lines are parsed', function(){
      nodelist = require('../')( path.join(__dirname, 'nodelist.txt') );
      assert(nodelist.nodelistLines.length > 0);
   });

   it('the ZIP-packed nodelist is read, lines are parsed', function(){
      nodelistZIP = require('../')( path.join(__dirname, 'nodelist.zip'), {
         zip: true
      });
      assert(nodelistZIP.nodelistLines.length > 0);
   });

   it('nodelists are found by wildcards as well', function(){
      var nodelistBleep = require('../')(
         path.join(__dirname, 'nodelist.t*')
      );
      var nodelistZIPBleep = require('../')(
         path.join(__dirname, 'nodelist.z*'),
         { zip: true }
      );
      assert.deepEqual(nodelist, nodelistBleep);
      assert.deepEqual(nodelistZIP, nodelistZIPBleep);
   });

   it('the "FGHI Global Headlight Ignited" node can be read', function(){
      idx = nodelist.nodelistLines.indexOf(testLine);
      assert.notEqual(idx, -1);
      idx = nodelistZIP.nodelistLines.indexOf(testLine);
      assert.notEqual(idx, -1);
   });

   it("almost the same node's line is read from another net", function(){
      var idx2;
      idx2 = nodelist.nodelistLines.indexOf(testLine2, idx+1);
      assert.notEqual(idx2, -1);
      idx2 = nodelistZIP.nodelistLines.indexOf(testLine2, idx+1);
      assert.notEqual(idx2, -1);
   });

   it("can find the line of Zone 2 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:2/0');
      assert.equal(line, lineZone2);
      line = nodelistZIP.getLineForAddr('2:2/0');
      assert.equal(line, lineZone2);
   });

   it("can't find the line of Zone 7 by number", function(){
      var line;
      line = nodelist.getLineForAddr('7:7/0');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('7:7/0');
      assert.strictEqual(line, null);
   });

   it("can find the line of Region 2:50 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:50/0');
      assert.equal(line, lineZone2Reg50);
      line = nodelistZIP.getLineForAddr('2:50/0');
      assert.equal(line, lineZone2Reg50);
   });

   it("can't find the line of Region 2:999 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:999/0');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('2:999/0');
      assert.strictEqual(line, null);
   });

   it("can't find the line of Region 1:50 by number", function(){
      var line;
      line = nodelist.getLineForAddr('1:50/0');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('1:50/0');
      assert.strictEqual(line, null);
   });

   it("can't find the line of Region 3:50 by number", function(){
      var line;
      line = nodelist.getLineForAddr('3:50/0');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('3:50/0');
      assert.strictEqual(line, null);
   });

   it("can find the line of Net 2:5063 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:5063/0');
      assert.equal(line, lineZone2Net5063);
      line = nodelistZIP.getLineForAddr('2:5063/0');
      assert.equal(line, lineZone2Net5063);
   });

   it("can't find the line of Net 1:5063 by number", function(){
      var line;
      line = nodelist.getLineForAddr('1:5063/0');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('1:5063/0');
      assert.strictEqual(line, null);
   });

   it("can find the line of Node 2:50/88 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:50/88');
      assert.equal(line, testLine);
      line = nodelistZIP.getLineForAddr('2:50/88');
      assert.equal(line, testLine);
   });

   it("can find the fields of Node 2:50/88 by number", function(){
      var fields;
      fields = nodelist.getFieldsForAddr('2:50/88');
      assert.deepEqual(fields, fieldsZone2Reg50Node88);
      fields = nodelistZIP.getFieldsForAddr('2:50/88');
      assert.deepEqual(fields, fieldsZone2Reg50Node88);
   });

   it("can find the line of Node 2:5063/88 by number", function(){
      var line;
      line = nodelist.getLineForAddr('2:5063/88');
      assert.equal(line, testLine2);
      line = nodelistZIP.getLineForAddr('2:5063/88');
      assert.equal(line, testLine2);
   });

   it("can't find the line of Node 1:5063/88 by number", function(){
      var line;
      line = nodelist.getLineForAddr('1:5063/88');
      assert.strictEqual(line, null);
      line = nodelistZIP.getLineForAddr('1:5063/88');
      assert.strictEqual(line, null);
   });

   it("can't find the fields of Node 3:50/88 by number", function(){
      var fields;
      fields = nodelist.getFieldsForAddr('3:50/88');
      assert.strictEqual(fields, null);
      fields = nodelistZIP.getFieldsForAddr('3:50/88');
      assert.strictEqual(fields, null);
   });
});