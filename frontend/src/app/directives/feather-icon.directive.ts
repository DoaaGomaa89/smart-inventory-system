import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import * as feather from 'feather-icons';

@Directive({
  selector: '[appFeatherIcon]'
})
export class FeatherIconDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    feather.replace({ class: '', ...this.el.nativeElement.dataset });
  }
}
