export interface ReportColumn {clave:string;titulo:string;tipo:'texto'|'fecha'|'entero'|'decimal'}
export type ReportRow=Record<string,string|number|null>;
// Textos de usuarios no se convierten en fórmulas al abrir una hoja de cálculo.
function cell(value:string|number|null,column:ReportColumn):string {
 let text=value===null?'':String(value);
 if(column.tipo==='decimal'&&!/^-?\d+(?:\.\d+)?$/.test(text))throw new Error('Decimal inválido en exportación');
 if(column.tipo==='entero'&&!/^-?\d+$/.test(text))throw new Error('Entero inválido en exportación');
 let first=0;while(first<text.length&&(text[first]!.trim()===''||text.charCodeAt(first)<=31||text.charCodeAt(first)===127))first++;
 if(column.tipo==='texto'&&first<text.length&&'=+-@'.includes(text[first]!))text="'"+text;
 text=text.split(String.fromCharCode(0)).join('');return '"'+text.replace(/"/g,'""')+'"';
}
export function reportCsv(columns:ReportColumn[],rows:ReportRow[]):string{return '\uFEFF'+columns.map(c=>cell(c.titulo,{...c,tipo:'texto'})).join(',')+'\r\n'+rows.map(row=>columns.map(c=>cell(row[c.clave]??null,c)).join(',')).join('\r\n')+(rows.length?'\r\n':'');}
