import { Component, input } from '@angular/core';
const paths = {
 incident:'M12 3 2 21h20z M12 9v5 M12 17h.01',
 tools:'M14 6a4 4 0 0 0-5 5L3 17v4h4l6-6a4 4 0 0 0 5-5l-3 2-3-3 2-3z',
 bus:'M4 17h16V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z M4 10h16 M8 3v7 M16 3v7 M6 17v4 M18 17v4 M7 14h1 M16 14h1',
 grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0',
 audit:'M9 5H5v16h14V5h-4 M9 3h6v4H9z M8 12h8 M8 16h6'
} as const;
@Component({selector:'app-icon',standalone:true,template:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path [attr.d]="paths[name()]" /></svg>',styles:':host{display:inline-flex;align-items:center;flex-shrink:0}'})
export class IconComponent { readonly name=input.required<keyof typeof paths>();readonly paths=paths; }
