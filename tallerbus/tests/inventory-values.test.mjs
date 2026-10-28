import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quantityUnits,positiveQuantity,validCost,decimalText,pendingQuantity} from '../frontend/src/app/core/inventory-values.ts';
test('cantidades exactas y pendientes con milésimas sin flotantes',()=>{assert.equal(quantityUnits('0.001'),1n);assert.equal(quantityUnits('-0.125'),-125n);assert.equal(pendingQuantity('10.001','9.999'),'0.002');assert.equal(pendingQuantity('4','4'),'0');for(const v of ['0','-1','1e3','1,5','0.0001'])assert.equal(positiveQuantity(v),false);assert.equal(positiveQuantity('999999999.999'),true);});
test('costos y formato conservan seis decimales y signo de fracciones negativas',()=>{assert.equal(validCost('0.000001'),true);assert.equal(validCost('-1'),false);assert.equal(validCost('1.0000001'),false);assert.equal(decimalText('-0.000001'),'-0.000001');assert.equal(decimalText('1000000.123456'),'1,000,000.123456');assert.equal(decimalText('0.100000'),'0.1');});
