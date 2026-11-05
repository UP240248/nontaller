// Calendar days in the workshop's time zone; stored as DATE, never elapsed milliseconds.
export function workshopToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function calendarDate(value:string){return new Date(value+'T00:00:00.000Z');}
export function calendarDay(value:Date){return value.toISOString().slice(0,10);}
export function nextMonth(day:string){const date=calendarDate(day);const year=date.getUTCFullYear(),month=date.getUTCMonth()+1;const last=new Date(Date.UTC(year,month+1,0)).getUTCDate();return new Date(Date.UTC(year,month,Math.min(date.getUTCDate(),last))).toISOString().slice(0,10);}
