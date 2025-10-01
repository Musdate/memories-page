import { Component } from '@angular/core';

@Component({
    selector: 'svg[logout-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <svg:path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
        <svg:path d="M9 12h12l-3 -3" />
        <svg:path d="M18 15l3 -3" />
    `,
    host: {
        '[attr.viewBox]': '"0 0 24 24"',
        '[attr.fill]': '"none"',
        '[attr.width]': '"24"',
        '[attr.height]': '"24"',
        '[attr.stroke]': '"currentColor"',
        '[attr.stroke-width]': '"2"',
        '[attr.stroke-linecap]': '"round"',
        '[attr.stroke-linejoin]': '"round"'
    }
})
export class LogoutIcon {}