const quantity=/^-?(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/;
export function quantityUnits(value:string):bigint|null{const text=value.trim();if(!quantity.test(text))return null;const negative=text.startsWith('-');const [whole,fraction='']=text.replace('-','').split('.');const units=BigInt(whole)*1000n+BigInt(fraction.padEnd(3,'0'));return negative?-units:units;}
export function positiveQuantity(value:string){const units=quantityUnits(value);return units!==null&&units>0n;}
export function validCost(value:string){return /^(?:0|[1-9]\d{0,8})(?:\.\d{1,6})?$/.test(value.trim());}
export function decimalText(value:string|undefined){if(value===undefined)return '—';const [whole,fraction='']=value.split('.');const decimals=fraction.replace(/0+$/,'');return (whole.startsWith('-')?'-':'')+BigInt(whole.replace('-','')).toLocaleString('es-MX')+(decimals?'.'+decimals:'');}
export function pendingQuantity(ordered:string,received:string){const units=(quantityUnits(ordered)??0n)-(quantityUnits(received)??0n);return (units/1000n).toString()+(units%1000n?'.'+(units%1000n).toString().padStart(3,'0').replace(/0+$/,''):'');}
