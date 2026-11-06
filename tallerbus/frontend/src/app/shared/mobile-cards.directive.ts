import { Directive, ElementRef, afterEveryRender, inject } from '@angular/core';

/** Reuses the same rows and permissions, adding labels for their mobile card view. */
@Directive({selector:'table[appMobileCards]',standalone:true,host:{class:'mobile-cards',role:'table'}})
export class MobileCardsDirective {
 private readonly element=inject<ElementRef<HTMLTableElement>>(ElementRef);
 constructor(){afterEveryRender(()=>this.labelCells());}
 private attr(element:Element,name:string,value:string){if(element.getAttribute(name)!==value)element.setAttribute(name,value);}
 private labelCells(){
  const table=this.element.nativeElement;
  const headings=Array.from(table.tHead?.querySelectorAll('th')??[]).map(cell=>cell.textContent?.trim()??'');
  for(const group of Array.from(table.children))if(['THEAD','TBODY','TFOOT'].includes(group.tagName))this.attr(group,'role','rowgroup');
  for(const row of Array.from(table.rows)){
   this.attr(row,'role','row');let column=0;
   const empty=row.cells.length===1&&row.cells[0]!.colSpan>1;
   this.attr(row,'data-empty',String(empty));
   for(const cell of Array.from(row.cells)){
    this.attr(cell,'role',cell.tagName==='TH'?'columnheader':'cell');
    if(cell.tagName==='TD'){
     const label=empty?'':headings[column]??'';
     this.attr(cell,'data-label',label);
     this.attr(cell,'data-actions',String(/acci[oó]n|atenci[oó]n|devoluci[oó]n/i.test(label)));
    }
    column+=cell.colSpan;
   }
  }
 }
}
